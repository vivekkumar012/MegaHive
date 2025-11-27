import React from 'react'
import { TbBrandMeta} from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"

const TopBar = () => {
  return (
    <div className='bg-[#ea2e02] text-white'>
      <div className='container mx-auto'>
        <div className='flex gap-4 items-center'>
            <a href="#">
                <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a href="#">
                <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a href="#">
                <RiTwitterXLine className='h-4 w-4'/>
            </a>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default TopBar
