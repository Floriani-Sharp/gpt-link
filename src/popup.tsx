import Logo from "data-base64:~/assets/icon.png"

import "./style.css"

function IndexPopup() {
  return (
    <section className="shadow-md border-gray-200 border-1 w-96">
      <header className="p-5 bg-gray-200/20 flex justify-between">
        {/* Extension Informations */}
        <figure className="flex">
          <img src={Logo} alt="Logo" title="GPT-Link" className="h-16" />
          <figcaption className="ml-2 flex flex-col justify-between">
            <h1 className="text-xl font-bold">GPT-Link</h1>
            <p>
              <a
                target="_blank"
                href="https://github.com/Floriani-Sharp/gpt-link#readme"
                className="text-[#0e76a8] text-sm font-medium">
                En savoir plus
              </a>
            </p>
          </figcaption>
        </figure>
        {/* Go to LinkedIn */}
        <a href="https://www.linkedin.com/" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </header>
      {/* Resume */}
      <section className="p-5 text-sm">
        <p>
          Augmentez votre productivité en postant et en commentant des contenus
          uniques et originaux sur LinkedIn.
        </p>
      </section>
    </section>
  )
}

export default IndexPopup
