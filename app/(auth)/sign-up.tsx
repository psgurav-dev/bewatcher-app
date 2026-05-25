import * as React from 'react'
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSSO, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
	const { isLoaded, signUp, setActive } = useSignUp()
	const router = useRouter()

	const [emailAddress, setEmailAddress] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [pendingVerification, setPendingVerification] = React.useState(false)
	const [code, setCode] = React.useState('')


	const onSignUpPress = async () => {
		if (!isLoaded) return

		try {
			await signUp.create({
				emailAddress,
				password,
			})

			// Send user an email with verification code
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

			setPendingVerification(true)
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2))
		}
	}

	// Handle submission of verification form
	const onVerifyPress = async () => {
		if (!isLoaded) return

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			})

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId })
				router.replace('/')
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2))
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2))
		}
	}

	if (pendingVerification) {
		return (
			<>
				<Text>Verify your email</Text>
				<TextInput
					value={code}
					placeholder="Enter your verification code"
					onChangeText={(code) => setCode(code)}
				/>
				<TouchableOpacity onPress={onVerifyPress}>
					<Text>Verify</Text>
				</TouchableOpacity>
			</>
		)
	}
	const { startSSOFlow } = useSSO()

	const handleGoogleLogin = async () => {
		try {
			const { createdSessionId, setActive } = await startSSOFlow({
				strategy: 'oauth_google',
				redirectUrl: "/"
			});
			if (createdSessionId) {
				setActive!({ session: createdSessionId });
			}
			else {
				console.error('Failed to create session');
			}
		} catch (err) {
			console.error('Google login error:', err);
		}
	};

	return (
		<View className=''>
			<>
				<Text>Sign up</Text>
				<TextInput
					autoCapitalize="none"
					value={emailAddress}
					placeholder="Enter email"
					onChangeText={(email) => setEmailAddress(email)}
				/>
				<TextInput
					value={password}
					placeholder="Enter password"
					secureTextEntry={true}
					onChangeText={(password) => setPassword(password)}
				/>
				<TouchableOpacity onPress={onSignUpPress}>
					<Text>Continue</Text>
				</TouchableOpacity>
				<View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
					<Text>Already have an account?</Text>
					<Link href="/(auth)/login">
						<Text>Sign in</Text>
					</Link>
				</View>

				<Button title="Sign up with Google" onPress={handleGoogleLogin} />

			</>
		</View>
	)
}