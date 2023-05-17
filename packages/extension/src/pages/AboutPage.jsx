const AboutPage = ({ setPage }) => {
  return (
    <div className="flex flex-col gap-2 p-4 text-sm">
      <div className="flex">
        <div className="flex-grow">
          <table>
            <tr>
              <td>Author:</td>
              <td>
                <a class="text-blue-500" href="https://matt-rickard.com">
                  Matt Rickard
                </a>
              </td>
            </tr>
            <tr>
              <td>Twitter:</td>
              <td>
                <a class="text-blue-500" href="https://twitter.com/mattrickard">
                  @mattrickard
                </a>
              </td>
            </tr>
            <tr>
              <td>GitHub:</td>
              <td>
                <a
                  class="text-blue-500"
                  href="https://github.com/r2d4/react-llm"
                >
                  r2d4/react-llm
                </a>
              </td>
            </tr>
            <tr>
              <td>License:</td>
              <td>MIT</td>
            </tr>
          </table>
        </div>
        <div className=" ">
          <button className="text-blue-500" onClick={() => setPage("main")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
