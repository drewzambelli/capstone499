
import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import {FaFire } from "react-icons/fa"
import {IoMdTrain} from "react-icons/io"
import { PiEmptyThin } from "react-icons/pi";
function DropDown() {
    const [selectedIcon, setSelectedIcon] = useState<{icon: React.ReactNode, text: string}>({icon: <span><PiEmptyThin /></span>, text: "Empty"})

    const handleDropDownItem = (icon : React.ReactNode, text: string) => {
        setSelectedIcon({icon: icon, text: text});
    }

  return (
    <div>
        <div className='flex justify-center'>
            <Dropdown className='pr-2'>
                <Dropdown.Toggle className='bg-bubble-gum ' variant='success' id='dropdown-basic'>
                    {selectedIcon.icon}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item className='flex justify-center w-auto' href='#' onClick={ () => handleDropDownItem(<FaFire/>, "Fire")}>
                    <div>
                        <div className='flex justify-center'>
                            <FaFire  className='text-dark-bubble'/>
                        </div>
                        <label>Fire</label>
                    </div>
                </Dropdown.Item>
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<IoMdTrain/>, "Commute")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <IoMdTrain />
                        </div>
                        <label>Commute</label>
                    </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    <label className='text-white'>Comment Type: {selectedIcon.text}</label>
  </div>
  )
}

export default DropDown