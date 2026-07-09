import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JSONAPIRequestProcessor, ClientError, ServerError } from '@orbit/jsonapi';
import { schema } from '$data/schema.js';
import Button from '$lib/buttons/Button';
import TextInput from '$lib/input-fields/TextInput';
import { API_BASE_URL, USE_MOCK_DATA } from '$lib/config';
import { Roles } from '$lib/constants/role';

export default function LoginPage() {
	const navigate = useNavigate();
	const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setErrorMessage('');
			setLoading(true);

			// Mode mock: login dummy, tidak hit backend sama sekali.
			// Email/password apapun dianggap valid, langsung dianggap Surveyor.
			if (USE_MOCK_DATA) {
				await new Promise((resolve) => setTimeout(resolve, 500));

				const dummyUser = {
					userId: 'dummy-user-1',
					attributes: { name: 'Surveyor Dummy', roleId: Roles.SURVEYOR },
					location: undefined
				};

				window.localStorage.setItem('token', 'dummy-token');
				window.localStorage.setItem('roleId', JSON.stringify(Roles.SURVEYOR));
				window.localStorage.setItem('user', JSON.stringify(dummyUser));

				navigate('/surveyor/home');
				return;
			}

			const requestProcessor = new JSONAPIRequestProcessor({
				sourceName: 'auth',
				schema,
				allowedContentTypes: ['application/json']
			});

			const responseProcessor = await requestProcessor.fetch(
				`${API_BASE_URL}/api/v1/auth/login?include=user.userLocation`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						data: {
							type: 'login',
							attributes: {
								email: loginDetails.email,
								password: loginDetails.password
							}
						}
					})
				}
			);

			const responseData = (responseProcessor as any).document.data;
			const responseIncluded = (responseProcessor as any).document.included;
			const token = responseData.attributes.plainTextToken;

			const { id: userId, attributes } = responseIncluded.find(
				(d: any) => d.type === 'users'
			);
			const location = responseIncluded.find((d: any) => d.type === 'userLocations');
			const { roleId } = attributes;

			if (!token) {
				throw new Error('Invalid email or password');
			}

			if (roleId != Roles.SURVEYOR && roleId != Roles.GARDENER) {
				throw new Error('Invalid role');
			}

			window.localStorage.setItem('token', token);
			window.localStorage.setItem('roleId', JSON.stringify(roleId));

			// Surveyor dibatasi query model users, jadi info user disimpan di localStorage
			const user = {
				userId,
				attributes,
				location: location
					? {
							id: location?.id,
							updatedAt: location?.attributes?.updatedAt
								? new Date(location.attributes.updatedAt)
								: new Date()
						}
					: undefined
			};

			window.localStorage.setItem('user', JSON.stringify(user));

			navigate('/surveyor/home');
		} catch (e: any) {
			if (e instanceof ClientError || e instanceof ServerError) {
				setErrorMessage((e as any).data?.error?.detail || 'An error occured');
			} else {
				setErrorMessage(e?.message || 'An error occured');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-center">
			{errorMessage && (
				<div className="flex justify-center mx-5 my-2 p-2 bg-danger-surface border border-danger-main rounded">
					<p className="text-sm text-danger-main">{errorMessage}</p>
				</div>
			)}

			{USE_MOCK_DATA && (
				<p className="text-center text-xs text-neutral-400 mb-2">
					Mode mock aktif — email/password apapun akan berhasil login
				</p>
			)}

			<div className="flex flex-col space-y-4 mx-4">
				<div className="space-y-4">
					<TextInput
						id="email"
						type="email"
						label="Email"
						required
						value={loginDetails.email}
						onInput={(e) =>
							setLoginDetails((prev) => ({ ...prev, email: e.target.value }))
						}
					/>
					<TextInput
						id="password"
						type="password"
						label="Password"
						required
						value={loginDetails.password}
						onInput={(e) =>
							setLoginDetails((prev) => ({ ...prev, password: e.target.value }))
						}
					/>
				</div>

				<Button
					label={loading ? 'Proses masuk...' : 'Masuk'}
					buttonType="primary"
					style="mx-5"
					isLoading={loading}
					action={handleLogin}
				/>
			</div>
		</div>
	);
}
