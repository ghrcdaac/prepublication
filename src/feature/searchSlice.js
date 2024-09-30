import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value: 'stage/'
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers:{
        setSearch: (state, action) => {
            //sets state to given value
            state.value = action.payload
        },
    },
})

export const { setSearch } = searchSlice.actions

export default searchSlice.reducer