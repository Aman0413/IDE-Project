import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closebrackets";
import Loader from "../componets/Loder";
import { useCookies } from "react-cookie";
import axios from "../utils/axiosClient";
import Footer from "../componets/Footer";

function Editor() {
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["language"]);

  const editotRef = useRef(null);

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    const expirationDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    setCookie("language", e.target.value, {
      path: "/",
      expires: expirationDate,
    });
  }

  const languageMap = {
    cpp: "cpp",
    java: "clike",
    python3: "python",
    javascript: "javascript",
  };

  async function runCode(code, language) {
    try {
      setLoading(true);
      const res = await axios.post("run", { code, language });
      setOutput(res.data.data);
      setLoading(false);

      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    editotRef.current = CodeMirror.fromTextArea(
      document.getElementById("editor"),
      {
        lineNumbers: true,
        mode: { name: languageMap[cookies.language], json: true },
        theme: "dracula",
        autofocus: true,
        autoCloseBrackets: true,
        matchBrackets: true,
      }
    );

    editotRef.current.on("change", (instance, changes) => {
      const code = instance.getValue();
      setCode(code);
    });
  }, []);

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center p-4  bg-[#2e3039]  border-b-2">
          <div className="text-left ">
            <select
              name=""
              id="language"
              className=" px-3 py-2 border rounded-lg border-gray-400 cursor-pointer"
              onChange={handleLanguageChange}
            >
              <option value="">Select Lanuage</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python3">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <div className="text-green-600 font-bold md:text-xl px-5">
            {cookies?.language}
          </div>

          <div className="text-center  w-full">
            <button
              className="bg-orange-700 text-white font-bold w-[100px] py-2 px-2 rounded-lg md:text-xl transition-all hover:bg-orange-800 ease-in-out duration-200 active:scale-95 text-center"
              onClick={() => {
                runCode(code, cookies.language ? cookies.language : language);
              }}
            >
              Run
            </button>
          </div>
        </div>

        <div className="w-full h-full flex md:flex-row flex-col">
          <div className="h-[110vh] flex-1">
            <textarea id="editor" />
          </div>
          <div className="bg-[#2e3039] md:h-[100vh] md:w-[30%] overflow-y-scroll p-4 md:border-l-2">
            <div>
              <button
                className="bg-orange-900 text-white px-4 py-2 rounded-lg font-bold transition-all hover:bg-orange-800 ease-in-out duration-200 active:scale-95"
                onClick={() => {
                  setOutput("");
                }}
              >
                Clear
              </button>

              <div className="text-white mt-4 font-terminal text-2xl">
                <div className="flex gap-4 ">
                  <p>
                    Code Time:{" "}
                    <span className="text-green-700 font-bold">
                      {output ? output.cpuTime : "00"}
                    </span>
                  </p>
                  <p>
                    Memory:{" "}
                    <span className="text-green-700 font-bold">
                      {output ? output.memory : "00"}
                    </span>
                  </p>
                </div>

                <h2 className="my-3 ">Output</h2>
                <p className="mt-5 text-2xl">
                  {loading ? (
                    <div className="w-full  h-[300px] ">
                      <Loader />
                    </div>
                  ) : (
                    <p
                      className={`mt-5 text-2xl ${
                        output.statusCode !== 200
                          ? "text-red-600"
                          : "text-white"
                      }`}
                    >
                      {output.output}
                    </p>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Editor;
