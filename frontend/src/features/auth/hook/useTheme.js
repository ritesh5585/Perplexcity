import applyTheme from "../../Theme/Theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useTheme = () => {
    const { isDark } = useSelector((state) => state.auth)

    useEffect(() => {
        applyTheme(isDark)
    }, [isDark]
    )

}

export default useTheme