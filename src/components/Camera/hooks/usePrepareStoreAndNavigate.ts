import { useNavigation, useRoute } from "@react-navigation/native";
import useDeviceStorageFull from "components/Camera/hooks/useDeviceStorageFull";
import {
  useCallback
} from "react";
import Observation from "realmModels/Observation";
import ObservationPhoto from "realmModels/ObservationPhoto";
import useStore from "stores/useStore";

import savePhotosToCameraGallery from "../helpers/savePhotosToCameraGallery";

const usePrepareStoreAndNavigate = ( ): Function => {
  const navigation = useNavigation( );
  const { params } = useRoute( );
  const addEvidence = params?.addEvidence;
  const setObservations = useStore( state => state.setObservations );
  const updateObservations = useStore( state => state.updateObservations );
  const evidenceToAdd = useStore( state => state.evidenceToAdd );
  const cameraUris = useStore( state => state.cameraUris );
  const currentObservation = useStore( state => state.currentObservation );
  const addCameraRollUris = useStore( state => state.addCameraRollUris );
  const currentObservationIndex = useStore( state => state.currentObservationIndex );
  const observations = useStore( state => state.observations );
  const setSavingPhoto = useStore( state => state.setSavingPhoto );
  const setCameraState = useStore( state => state.setCameraState );

  const { deviceStorageFull, showStorageFullAlert } = useDeviceStorageFull( );

  const numOfObsPhotos = currentObservation?.observationPhotos?.length || 0;

  const handleSavingToPhotoLibrary = useCallback( async (
    uris,
    addPhotoPermissionResult,
    userLocation = null
  ) => {
    if ( addPhotoPermissionResult !== "granted" ) return Promise.resolve( );
    if ( deviceStorageFull ) {
      showStorageFullAlert( );
      return Promise.resolve( );
    }
    setSavingPhoto( true );
    const savedPhotoUris = await savePhotosToCameraGallery( uris, userLocation );
    if ( savedPhotoUris.length > 0 ) {
      // Save these camera roll URIs, so later on observation editor can update
      // the EXIF metadata of these photos, once we retrieve a location.
      addCameraRollUris( savedPhotoUris );
    }
    // When we've persisted photos to the observation, we don't need them in
    // state anymore
    setCameraState( { evidenceToAdd: [], cameraUris: [], savingPhoto: false } );
    return null;
  }, [
    addCameraRollUris,
    deviceStorageFull,
    setCameraState,
    setSavingPhoto,
    showStorageFullAlert
  ] );

  const createObsWithCameraPhotos = useCallback( async (
    uris,
    addPhotoPermissionResult,
    userLocation
  ) => {
    const newObservation = await Observation.new( );

    // 20240709 amanda - this is temporary since we'll want to move this code to
    // Suggestions after the changes to permissions github issue is complete, and
    // we'll be able to updateObservationKeys on the observation there
    if ( userLocation?.latitude ) {
      newObservation.latitude = userLocation?.latitude;
      newObservation.longitude = userLocation?.longitude;
      newObservation.positional_accuracy = userLocation?.positional_accuracy;
    }
    newObservation.observationPhotos = await ObservationPhoto
      .createObsPhotosWithPosition( uris, {
        position: 0,
        local: true
      } );
    setObservations( [newObservation] );
    await handleSavingToPhotoLibrary(
      uris,
      addPhotoPermissionResult,
      userLocation
    );
  }, [setObservations, handleSavingToPhotoLibrary] );

  const updateObsWithCameraPhotos = useCallback( async addPhotoPermissionResult => {
    const obsPhotos = await ObservationPhoto.createObsPhotosWithPosition(
      evidenceToAdd,
      {
        position: numOfObsPhotos,
        local: true
      }
    );
    const updatedCurrentObservation = Observation
      .appendObsPhotos( obsPhotos, currentObservation );
    observations[currentObservationIndex] = updatedCurrentObservation;
    updateObservations( observations );
    await handleSavingToPhotoLibrary( evidenceToAdd, addPhotoPermissionResult );
  }, [
    evidenceToAdd,
    numOfObsPhotos,
    currentObservation,
    observations,
    currentObservationIndex,
    updateObservations,
    handleSavingToPhotoLibrary
  ] );

  const prepareStoreAndNavigate = useCallback( async ( {
    visionResult,
    addPhotoPermissionResult,
    userLocation,
    newPhotoState
  } ) => {
    // when backing out from ObsEdit -> Suggestions -> Camera, create a
    // new observation
    const uris = newPhotoState?.cameraUris || cameraUris;
    if ( addEvidence ) {
      await updateObsWithCameraPhotos( addPhotoPermissionResult );
      return navigation.goBack( );
    }

    await createObsWithCameraPhotos( uris, addPhotoPermissionResult, userLocation );
    return navigation.push( "Suggestions", {
      entryScreen: "CameraWithDevice",
      lastScreen: "CameraWithDevice",
      aiCameraSuggestion: visionResult || null
    } );
  }, [
    addEvidence,
    cameraUris,
    createObsWithCameraPhotos,
    navigation,
    updateObsWithCameraPhotos
  ] );

  return prepareStoreAndNavigate;
};

export default usePrepareStoreAndNavigate;