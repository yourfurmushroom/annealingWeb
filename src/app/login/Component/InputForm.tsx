interface InputFormProps {
  name: string;
  icon: React.ReactNode;
}

function InputForm({ name, icon }: InputFormProps) {
  let columnName = "";

  if(name === "Username"){
    columnName = "使用者名稱"
  } else {
    columnName = "密碼"
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-4 lg:col-span-6">
        <label
          htmlFor={name}
          className="block text-sm/6 text-gray-600 font-semibold"
        >
          {columnName}
        </label>
        <div className="mt-2">
          <div
            className="group flex items-center rounded-md bg-white pl-3 outline-1 
                         -outline-offset-1 outline-gray-300 
                         focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600
                         transition-all duration-150 ease-in-out 
                         focus-within:scale-105"
          >
            <span className="text-gray-500 group-focus-within:text-indigo-500">
              {icon}
            </span>
            <input
              id={name}
              type={name.toLowerCase() === "password" ? "password" : "text"}
              name={name}
              placeholder={`請輸入${columnName}`}
              className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 
                           text-base text-gray-900 placeholder:text-gray-400 
                           focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const userIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const passwordIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
    />
  </svg>
);

function LoginForm() {
  return (
    <>
      <InputForm name="Username" icon={userIcon} />
      <InputForm name="Password" icon={passwordIcon} />
      <div className="mt-5">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs 
                     hover:bg-indigo-500 
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                     transition-transform duration-150 ease-in-out
                     active:scale-105"
        >
          登入
        </button>
      </div>
    </>
  );
}

export default LoginForm;
