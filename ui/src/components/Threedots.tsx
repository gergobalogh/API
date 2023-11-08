import {Box, keyframes, usePrefersReducedMotion} from "@chakra-ui/react";

const styles = {
    dot1: {
        position: "relative",
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: "#213163",
        color: "#213163",
        display: " inline-block",
        margin: "0 2px"
    },
    dot2: {
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: "#213163",
        color: "#213163",
        display: "inline-block",
        margin: "0 2px"
    },

    dot3: {
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: "#213163",
        display: "inline-block",
        margin: "0 2px"
    }
};

const Threedots = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const keyframe_dot1 = keyframes`
      0%, 60% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    `;
    const keyframe_dot2 = keyframes`
      0%, 60% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    `;
    const keyframe_dot3 = keyframes`
      0%, 60% {
        transform: translateY(0);
      }
      70% {
        transform: translateY(-10px);
      }
    `;
    const animation1 = prefersReducedMotion ? undefined : `${keyframe_dot1} infinite 0.8s linear`;
    const animation2 = prefersReducedMotion ? undefined : `${keyframe_dot2} infinite 0.9s linear`;
    const animation3 = prefersReducedMotion ? undefined : `${keyframe_dot3} infinite 1s linear`;
    return (
        <Box>
            <Box w="10" animation={animation1}/>
            <Box style={styles.dot1} animation={animation1}/>
            <Box style={styles.dot2} animation={animation2}/>
            <Box style={styles.dot3} animation={animation3}/>
        </Box>
    )
}
export default Threedots;
