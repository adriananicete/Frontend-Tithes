function OauthButton({name, img}) {
    return ( 
        <div className="cursor-pointer bg-[] border border-gray-400 flex justify-center items-center p-3 gap-2 rounded-[3px]">
            <img src={img} width={16} height={16} alt="logo" />
            <p className="text-xs">{name}</p>
        </div>
     );
}

export default OauthButton;