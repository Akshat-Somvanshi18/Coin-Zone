import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
    'x-rapidapi-key': process.env.REACT_APP_COIN_RANKING_API_KEY,
   'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
}

const baseUrl = "https://coinranking1.p.rapidapi.com";

const createRequest = (url) => ({url, headers:cryptoApiHeaders})
export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) =>({
        getCryptos: builder.query({
            query:(count)=> createRequest(`/coins?limit=${count}`)
        }),
        getCryptoDetails: builder.query({
            query:(coinId)=> createRequest(`/coin/${coinId}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`)
        }),
        getCryptoHistory: builder.query({
            query:({coinId,timePeriod})=> createRequest(`https://coinranking1.p.rapidapi.com/coin/${coinId}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${timePeriod}`)
        }),
        
    })
})

export const {
    useGetCryptosQuery,useGetCryptoDetailsQuery, useGetCryptoHistoryQuery
} = cryptoApi;