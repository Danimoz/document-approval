import {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const usePasswordToggle = () => {
    const [visible, setVisibility] = useState(false)

    const Icon = (
        <FontAwesomeIcon 
            icon={ visible ? faEyeSlash : faEye }
            onClick={() => setVisibility(visibility => !visibility)} 
        />
    )

    const inputType = visible ? 'text' : 'password'

    return [inputType, Icon]
}

export default usePasswordToggle