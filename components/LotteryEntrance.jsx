import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0x")
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    let isLoading, isFetching

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        params: {},
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        params: {},
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        params: {},
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        params: {},
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
    })

    const dispatch = useNotification()
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotfication(tx)
        await updateUI()
    }

    const handleNewNotfication = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notificiation",
            icon: "bell",
            position: "topR",
        })
    }

    const updateUI = async function () {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fees: {ethers.utils.formatUnits(entranceFee, "ether")}</div>
                    <div>ETH Players: {numberOfPlayers} </div>
                    <div> Recent Winner: {recentWinner} </div>
                </div>
            ) : (
                <div>No raffle address detected</div>
            )}
        </div>
    )
}
