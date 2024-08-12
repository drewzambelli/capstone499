import React from "react"
import {motion} from "framer-motion"
import IMAGES from "./img/images"
const AnimatedLogo: React.FC = ( ) => {
    return(

        <motion.img
            initial='hidden'
            src={IMAGES.logo}
            animate={{
                x: [0, -20, -1]
            }}
            transition={{
                duration:2,
                repeat: Infinity,
                repeatType: 'loop'
            }}/>

    )
}

export default AnimatedLogo