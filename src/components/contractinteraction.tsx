import React from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ABI } from "../contants/contants";

const ContractInteract = () => {
    const CONTRACT_ADDRESS = '0x6FC56962757C767551f3d2d15e6d665f51bbaD7A';

    const { data: storedInteger, refetch: refetchStoredInteger } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'storedInteger',
    });

    const { writeContract } = useWriteContract();

    const [txHash, setTxHash] = React.useState<`0x${string}` | undefined>(undefined);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ hash: txHash });

    async function handleIncrement() {
        try {
            const result = await writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'increment'
            });
            setTxHash(result!);
        } catch (error) {
            console.error("Error incrementing:", error);
        }
    }

    React.useEffect(() => {
        if (isConfirmed) {
            refetchStoredInteger();
        }
    }, [isConfirmed, refetchStoredInteger]);

    return (
        <div>
            <p>Stored Integer: {storedInteger !== undefined ? String(storedInteger) : 'Loading...'}</p>
            <button onClick={handleIncrement} disabled={isConfirming}>
                {isConfirming ? 'Confirming...' : 'Increment'}
            </button>
            {isConfirmed && <p>Successfully incremented!</p>}
        </div>
    );
}

export default ContractInteract;