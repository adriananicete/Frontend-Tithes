function Button({ icon: Icon, titleName}) {
    return ( 
        <button className="w-full bg-black text-white rounded-[5px] py-2 text-[13px] cursor-pointer flex justify-center items-center gap-2"><Icon size={18} />{titleName}</button>
     );
}

export default Button;