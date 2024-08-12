
import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import {FaFire } from "react-icons/fa" //Fire icon
// import {IoMdTrain} from "react-icons/io" //Train icon
import {FaGun} from "react-icons/fa6" //Gun icon
import { GiPoliceOfficerHead } from "react-icons/gi"; //police icon
import { MdCelebration } from "react-icons/md"; //celebration icon
import { FaPoop } from "react-icons/fa6"; //poop icon
import { IoRestaurant } from "react-icons/io5"; //restuarant icon
import { IoBusiness } from "react-icons/io5"; //business icon
import { MdTraffic } from "react-icons/md"; //traffic light
import { FaCarCrash } from "react-icons/fa"; //car accident
import { PiEmptyThin } from "react-icons/pi";

interface DropDownProps{
    onIconSelect: (icon: string) => void;

}

const DropDown: React.FC<DropDownProps> = ({onIconSelect})=> {
    const [selectedIcon, setSelectedIcon] = useState<{icon: React.ReactNode, text: string}>({icon: <span><PiEmptyThin /></span>, text: "Empty"})

    const handleDropDownItem = (icon : React.ReactNode, text: string, mongoIcon: string) => {
        setSelectedIcon({icon: icon, text: text});
        onIconSelect(mongoIcon);
    }

    
  return (
    <div>
        <div className='flex justify-center'>
            <Dropdown className='pr-2'>
                <Dropdown.Toggle className='bg-bubble-gum flex ' variant='success' >
                    {selectedIcon.icon}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {/* COMMUTE CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<FaCarCrash />, "Accident", "FaCarCrash")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <FaCarCrash />
                        </div>
                        <label>Accident</label>
                    </div>
                    </Dropdown.Item>

                    {/* COMMUTE CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<IoBusiness />, "Business", "IoBusiness")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <IoBusiness  />
                        </div>
                        <label>Business Review</label>
                    </div>
                    </Dropdown.Item>

                    {/* GUN CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<FaGun/>, "Danger", "FaGun")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <FaGun />
                        </div>
                        <label>Danger</label>
                    </div>
                    </Dropdown.Item>

                    {/* POOP CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<FaPoop />, "Poop", "FaPoop")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <FaPoop  />
                        </div>
                        <label>Feces</label>
                    </div>
                    </Dropdown.Item>

                    {/* CELEBRATION CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<MdCelebration/>, "Festival", "MdCelebration")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <MdCelebration  />
                        </div>
                        <label>Festival</label>
                    </div>
                    </Dropdown.Item>

                    {/* FOOD CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<IoRestaurant />, "Restaurant", "IoRestaurant")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <IoRestaurant />
                        </div>
                        <label>Food Review</label>
                    </div>
                    </Dropdown.Item>

                    {/* FIRE CLASS*/}
                    <Dropdown.Item className='flex justify-center w-auto' href='#' onClick={ () => handleDropDownItem(<FaFire/>, "Fire", "FaFire")}>
                        <div>
                            <div className='flex justify-center'>
                                <FaFire  className='text-dark-bubble'/>
                            </div>
                            <label>Fire</label>
                        </div>
                    </Dropdown.Item>

                    {/* POLICE CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<GiPoliceOfficerHead/>, "Police", "GiPoliceOfficerHead" )}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <GiPoliceOfficerHead />
                        </div>
                        <label>Police Presence</label>
                    </div>
                    </Dropdown.Item>

                    {/* TRAFFIC CLASS*/}
                    <Dropdown.Item className='flex justify-center' href="#" onClick={ () => handleDropDownItem(<MdTraffic />, "Traffic", "MdTraffic")}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <MdTraffic  />
                        </div>
                        <label>Traffic</label>
                    </div>
                    </Dropdown.Item>



                </Dropdown.Menu>
            </Dropdown>
        </div>
    <label className='text-dark'>Comment Type: {selectedIcon.text}</label>
  </div>
  )
}

export default DropDown