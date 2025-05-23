import { Organization } from '@/interfaces/Organization';
import React from 'react';

import api from '@/lib/axiosConfig';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export interface ActiveInvite {
	userId: string;
	token: string;
	orgId: string;
	createdAt: string;
	organization: {
		name: string;
		id: string;
	};
}

export interface User {
	name: string;
	email: string;
	id: string;
	token: string;
	organizations: Organization[];
	activeInvites: ActiveInvite[];
}

interface UserContextType {
	user: User;
	updateUser: () => void;
	selectedOrganization: string;
	updateSelectedOrganization: (orgId: string) => void;
}

export const UserContext = createContext<UserContextType>({
	user: { name: '', email: '', id: '', token: '', organizations: [], activeInvites: [] },
	updateUser: () => {},
	selectedOrganization: '',
	updateSelectedOrganization: () => {}
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User>({
		name: '',
		email: '',
		id: '',
		token: '',
		organizations: [],
		activeInvites: []
	});

	const [selectedOrganization, setSelectedOrganization] = useState<string>('');

	useEffect(() => {
		updateUser();
	}, []);

	const updateUser = () => {
		const token = localStorage.getItem('token');
		const org = localStorage.getItem('selectedOrganization');

		if (org) {
			setSelectedOrganization(org);
		}

		if (token) {
			api.get(`/users/me`)
				.then((resp) => {
					setUser(resp.data);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			setUser({
				name: '',
				email: '',
				id: '',
				token: '',
				organizations: [],
				activeInvites: []
			});
			setSelectedOrganization('');
		}
	};

	return (
		<UserContext.Provider value={{ user, updateUser, selectedOrganization, updateSelectedOrganization: setSelectedOrganization }}>
			{children}
		</UserContext.Provider>
	);
};
