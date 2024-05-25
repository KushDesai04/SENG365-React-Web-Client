import create from 'zustand';
interface UserState {

    userId: number;
    userToken: string;
    setUserId: (userId: number) => void;
    setUserToken: (userToken: string) => void;
    removeUser: () => void;
}

const getUserId = (key: string): number => JSON.parse(window.localStorage.getItem(key) as string);
const getUserToken = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setUserId = (key: string, value: number) => window.localStorage.setItem(key, JSON.stringify(value));
const setUserToken = (key: string, value: string) => window.localStorage.setItem(key, JSON.stringify(value));
const removeLocalStorage = () => {window.localStorage.removeItem("userId"); window.localStorage.removeItem('userToken')};

const useStore = create<UserState>((set) => ({
    userId: getUserId('userId'),
    userToken: getUserToken('userToken'),
    userImageChanged: false,

    setUserId: (userId: number) => set(() => {
        setUserId('userId', userId)
        return {userId: userId}
    }),

    setUserToken: (userToken: string) => set(() => {
        setUserToken('userToken', userToken)
        return {userToken: userToken}
    }),

    removeUser: () => {
        removeLocalStorage()
    },
}))
export const useUserStore = useStore;