import { GetThunkAPI, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AsyncThunk } from "@reduxjs/toolkit";

export const createAsyncThunkWithReject = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: GetThunkAPI<any>,
  ) => Promise<Returned>,
): AsyncThunk<Returned, ThunkArg, { rejectValue: any }> => {
  return createAsyncThunk<Returned, ThunkArg, { rejectValue: any }>(
    typePrefix,
    async (arg: ThunkArg, thunkAPI) => {
      try {
        return await payloadCreator(arg, thunkAPI);
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (!error.response) {
          throw err;
        }
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
  );
};
