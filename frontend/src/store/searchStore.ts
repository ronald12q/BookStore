import {create} from 'zustand'



interface searchParam {
    param: string,
    setParam: (param: string) => void;

}


export const searchStore = create<searchParam>((set) => ({
    param: '',

    setParam: (param: string) => set(() => ({ param: param }))

}));