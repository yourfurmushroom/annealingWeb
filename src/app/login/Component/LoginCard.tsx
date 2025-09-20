import LoginForm from "./InputForm";

function LeftIntroPart() {
  return (
    <div className="w-3/5 h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col item-start justify-start p-10 pl-15 pt-[15vh] text-white">
      <h1 className="font-extrabold text-[30px] mb-4">退火演算法網頁 Demo</h1>
      <p className="mb-2">
        本網頁將以互動式的遊戲與體驗，帶領使用者更近一步認識退火算法。
      </p>
      <p>現在登入，立即體驗。</p>
    </div>
  );
}

function RightLoginPart() {
  return (
    <div className="w-2/5 h-full bg-white flex items-center flex-col justify-start p-8 pt-[15vh] mb-20">
      <p className="text-indigo-500 text-[23px] font-bold text-center">
        使用者登入
      </p>
      <LoginForm />
    </div>
  );
}

function LoginCard() {
  return (
    <div className="fixed  w-[70%] h-[70vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 overflow-hidden">
      <div className="flex w-full h-full rounded-xl overflow-hidden shadow-lg">
        <LeftIntroPart />
        <RightLoginPart />
      </div>
    </div>
  );
}

export default LoginCard;
