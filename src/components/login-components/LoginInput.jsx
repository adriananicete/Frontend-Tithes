import { useState } from "react";

function LoginInput({
  inputType,
  placeholder,
  icon: Icon,
  icon2: Icon2,
  icon3: Icon3,
  name,
  titleName,
  secondName,
  onChange,
}) {
  const [type, setType] = useState(inputType);

  const handleClick = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full bg-[]">
      <div className="bg-[] flex justify-between items-center">
        <p className="text-xs text-gray-600">{titleName}</p>
        <p className="text-[10px] text-indigo-400">{secondName}</p>
      </div>

      <div className="bg-[] border border-gray-700 w-full p-2 flex justify-between items-center rounded-[5px]">
        <Icon size={18} />
        <input
          className="bg-[] w-[92%] px-2 rounded-[3px] bg-[transparent] outline-none text-xs"
          type={type || inputType}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          required
          autoComplete=""
        />
        {Icon2 && Icon3 && (
    <button
      type="button"
      onClick={handleClick}
      className="bg-transparent cursor-pointer"
    >
      {type === "password" ? <Icon3 size={18} /> : <Icon2 size={18} 
  />}
    </button>
  )}
      </div>
    </div>
  );
}

export default LoginInput;
