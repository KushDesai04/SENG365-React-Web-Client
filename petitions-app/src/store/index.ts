import create from 'zustand';
interface UserState {

    user: User;
    userId: number;
    setUser: (user: User) => void;
    setUserId: (userId: number) => void;
    removeUser: () => void;
}

const getUser = (key: string): User => JSON.parse(window.localStorage.getItem(key) as string);
const getUserId = (key: string): number => JSON.parse(window.localStorage.getItem(key) as string);
const setUser = (key: string, value: User) => window.localStorage.setItem(key, JSON.stringify(value));
const setUserId = (key: string, value: number) => window.localStorage.setItem(key, JSON.stringify(value));
const removeLocalStorage = (key: string) => {window.localStorage.removeItem(key); window.localStorage.removeItem('userId')};

const useStore = create<UserState>((set) => ({
    user: getUser('user') || null,
    userId: getUserId('userId'),

    setUser: (user: User) => set(() => {
        setUser('user', user)
        return {user: user}
    }),

    setUserId: (userId: number) => set(() => {
        setUserId('userId', userId)
        return {userId: userId}
    }),

    removeUser: () => {
        removeLocalStorage("user")
    }
}))
export const useUserStore = useStore;