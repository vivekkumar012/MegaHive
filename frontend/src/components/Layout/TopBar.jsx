import React from 'react'
import { TbBrandMeta} from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"

const TopBar = () => {
  return (
    <div className='bg-[#ea2e02] text-white'>
      <div className='container mx-auto flex justify-between py-3 px-4 items-center'>
        <div className='hidden md:flex gap-4 items-center'>
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
        <div className='text-sm text-center flex-grow'>
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>
        <div className='text-sm hidden md:block'>
          <a href="tel:+123456789" className='hover:text-gray-300'>
            +91 8434288510
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
