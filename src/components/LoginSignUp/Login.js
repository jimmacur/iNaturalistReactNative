// @flow strict-local

import React, { useEffect, useState } from "react";
import {Button, Text, TextInput, View} from "react-native";
import type { Node } from "react";

import { viewStyles, textStyles } from "../../styles/login/login";
import { isLoggedIn, authenticateUser, getUsername, signOut } from "./AuthenticationService";

const Login = (): Node => {
  const [email, setEmail] = useState( "" );
  const [password, setPassword] = useState( "" );
  const [loggedIn, setLoggedIn] = useState( false );
  const [error, setError] = useState( null );
  const [username, setUsername] = useState( null );

  useEffect( () => {
    let isCurrent = true;

    isLoggedIn().then( ( result ) => {
      if ( !isCurrent ) {return;}

      setLoggedIn( result );
    } );

    return ( ) => {
      isCurrent = false;
    };
  }, [] );

  const login = async () => {
    const success = await authenticateUser(
      email,
      password
    );

    if ( !success ) {
      setError( "Couldn't login" );
      return;
    }

    setUsername( await getUsername() );
    setLoggedIn( true );
  };

  const onSignOut = async () => {
    await signOut();
    setLoggedIn( false );
  };

  return (
    <View>
      {!loggedIn ? (
        <>
          <Text style={textStyles.text}>Login</Text>

          <Text style={textStyles.text}>Email</Text>
          <TextInput
            style={viewStyles.input}
            onChangeText={setEmail}
            value={email}
            autoCompleteType={"email"}
            testID="Login.email"
          />
          <Text style={textStyles.text}>Password</Text>
          <TextInput
            style={viewStyles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            testID="Login.password"
          />
          <Button title="Login" onPress={login} testID="Login.loginButton" />

          {error && <Text style={textStyles.error}>{error}</Text>}
        </>
      ) : (
        <>
          <Text style={textStyles.text} testID="Login.loggedInAs">Logged in as: {username}</Text>
          <Button title="Sign out" onPress={onSignOut} testID="Login.signOutButton" />
        </>
      )}
    </View>
  );
};

export default Login;
