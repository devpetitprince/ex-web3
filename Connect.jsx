import { getWeb3ReactContext, UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { useState } from "react"
import { injected } from "../utils/connectors"
import { useInactiveListener, useWeb3Connect} from "../utils/hooks"
import styled from 'styled-components';
import { NoEthereumProviderError, UserRejectedRequestError } from "@web3-react/injected-connector";


const StyledActivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    cursor: pointer;
`;

const StyledDeactivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    cursor: pointer;
`;




function Activate() {
    const context = useWeb3React();
    const { activate, active } = context;
    const [activating, setActivating] = useState(false);

    const handleActivate = (event) => {
        event.preventDefault();

        async function _activate() {
            setActivating(true);
            await activate(injected);
            setActivating(false);

        }
        _activate();
    };

    const eagerConnectSuccessful = useWeb3Connect();
    useInactiveListener(!eagerConnectSuccessful);

    return (
        <StyledActivateButton disabled={active} 
            style = {{ 
                borderColor: activating ? 'orange': active ? 'unset': 'green'
            }}
            onClick={handleActivate}>Connect</StyledActivateButton>
    );
}

const Deactivate = () => {
    const context = useWeb3React()
    const { deactivate, active } = context

    const handleDeactive = (event) => {
        event.preventDefault();

        deactivate();
    }

    return (
        <StyledDeactivateButton disabled = {!active}
        style={{ borderColor: active ? 'red' : 'unset'
        }} 
        onClick={handleDeactive}>Disconnect</StyledDeactivateButton>
    )

}

function getErrorMessage(error) {
    let errorMessage;

    switch(error.constructor) {
        case NoEthereumProviderError:
            errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension`;
            break;
        case UnsupportedChainIdError:
            errorMessage = `You're connected to an unsupported network`;
            break;
        case UserRejectedRequestError:
            errorMessage = `Please authorize this website to access your Ethereum account`;
            break;
        default:
            errorMessage = error.message;
    }

    return errorMessage;
}

export function Connect() {
    const { error } = useWeb3React()

    if (error) {
        window.alert(getErrorMessage(error))
    }

    return (
        <>
        <Activate />
        <Deactivate />
        </>
    )
}