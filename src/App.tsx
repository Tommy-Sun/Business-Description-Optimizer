import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import DateTimePicker from "react-datetime-picker";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const googleOriginalBusinessDescription = `Experience the delight of custom-made coffee at your local 7-Eleven, your go-to destination for coffee nearby. At 7-Eleven, we understand that everyone's coffee preference is unique. That's why our self-serve coffee stations are designed to let you craft your perfect cup of coffee. In addition to being your local hub for the best coffee nearby, we offer a broad selection of fresh, high-quality products at an everyday fair price. Furthermore, our fast, convenient, and delicious hot foods are designed to cater to any craving, ensuring that your on-the-go meals are always satisfying. Don't forget to text '7Rewards' to 711711 to download the 7-Eleven app and join 7Rewards for exclusive perks and promotions.`;
  const appleOriginalBusinessDescription = `Experience the delight of custom-made coffee at your local 7-Eleven, your go-to destination for coffee nearby. At 7-Eleven, we understand that everyone's coffee preference is unique. That's why our self-serve coffee stations are designed to let you craft your perfect cup of coffee.`;
  const facebookOriginalBusinessDescription = `Experience the delight of custom-made coffee at your local 7-Eleven, your go-to destination for coffee nearby.`;

  const address = "Orlando, FL.";
  const primaryCategory = "Convenience Store";
  const businessName = "7-eleven";

  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);

  const [locationKeyWords, setLocationKeyWords] = useState("");
  const [highValueProducts, setHighValueProducts] = useState("");
  const [style, setStyle] = useState("");
  const [openingDate, setOpeningDate] = useState(new Date());
  const [mentionPrimaryBusiness, setMentionPrimaryBusiness] = useState(false);
  const [optimizeGoogle, setOptimizeGoogle] = useState(false);
  const [optimizeFacebook, setOptimizeFacebook] = useState(false);
  const [optimizeApple, setOptimizeApple] = useState(false);
  const [
    googleOptimizedBusinessDescription,
    setGoogleOptimizedBusinessDescription,
  ] = useState("");
  const [
    appleOptimizedBusinessDescription,
    setAppleOptimizedBusinessDescription,
  ] = useState("");
  const [
    facebookOptimizedBusinessDescription,
    setFacebookOptimizedBusinessDescription,
  ] = useState("");

  console.log(
    "optimized business description: ",
    googleOptimizedBusinessDescription
  );

  const onSubmit = async () => {
    console.log(mentionPrimaryBusiness);
    console.log(
      optimizeApple,
      optimizeFacebook,
      optimizeGoogle,
      style,
      `${openingDate.getMonth()}/${openingDate.getDate()}/${openingDate.getFullYear()}`,
      highValueProducts,
      locationKeyWords
    );
    // let prompt = `Rewrite and shorten the following business description which is between the curly brackets like so {}: {${originalBusinessDescription}}. Make sure to use the business name: ${businessName} and include appropriate parts of the ${address} and taking into account the category ${primaryCategory}. The output should be a business description between 250 and 750 characters long`;

    const getCompletion = async (
      description: string,
      maxTokens: number,
      min: number,
      max: number
    ) => {
      let prompt = `Rewrite and shorten the following business description: {${description}}. Make sure to use the business name: ${businessName} and include appropriate parts of the ${address} and taking into account the category ${primaryCategory}.`;
      if (locationKeyWords.length > 0) {
        prompt += ` Make sure to include the following keywords: ${locationKeyWords}. Place them towards the beginning of the description`;
      }
      if (highValueProducts.length > 0) {
        prompt += ` Make sure to include a mention of one or more of the high value products: ${highValueProducts}`;
      }
      if (openingDate != null) {
        prompt += ` Make sure to include a mention of when the business opened on: ${openingDate.getMonth()}/${openingDate.getDate()}/${openingDate.getFullYear()}`;
      }
      if (style.length > 0) {
        prompt += ` The response should also be ${style}.`;
      }
      prompt += ` Make sure to respond within ${min} and ${max} characters`;
      return await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
        max_tokens: maxTokens,
        temperature: 1.0,
      });
    };
    let completionGoogle;
    let completionApple;
    let completionFacebook;
    if (optimizeGoogle) {
      completionGoogle = await getCompletion(
        googleOriginalBusinessDescription,
        180,
        225,
        725
      );
    }
    if (optimizeApple) {
      completionApple = await getCompletion(
        appleOriginalBusinessDescription,
        125,
        5,
        475
      );
    }
    if (optimizeFacebook) {
      completionFacebook = await getCompletion(
        facebookOriginalBusinessDescription,
        38,
        10,
        140
      );
    }
    console.log(
      completionGoogle?.data.choices[0].message?.content ?? "".length
    );
    console.log(completionApple?.data.choices[0].message?.content ?? "".length);
    console.log(
      completionFacebook?.data.choices[0].message?.content ?? "".length
    );
    setGoogleOptimizedBusinessDescription(
      completionGoogle?.data.choices[0].message?.content ?? ""
    );
    setAppleOptimizedBusinessDescription(
      completionApple?.data.choices[0].message?.content ?? ""
    );
    setFacebookOptimizedBusinessDescription(
      completionFacebook?.data.choices[0].message?.content ?? ""
    );
  };

  return (
    <div className="App">
      <h2 className="header">Optimize Business Description with AI</h2>
      {googleOptimizedBusinessDescription.length < 1 &&
      appleOptimizedBusinessDescription.length < 1 &&
      facebookOptimizedBusinessDescription.length < 1 ? (
        <div className="container">
          <h4>SEO Optimization</h4>
          <input
            type="checkbox"
            defaultChecked={mentionPrimaryBusiness}
            onChange={() => setMentionPrimaryBusiness(!mentionPrimaryBusiness)}
          />
          <label>Mention the primary business category</label>
          <br />

          <label className="small-container">
            Add mentions of high value products / services
          </label>
          <br />
          <input
            value={highValueProducts}
            onChange={(event) => setHighValueProducts(event.target.value)}
            placeholder="Fast service, Hard to find items"
            className="input-bar"
          />
          <br />

          <label className="small-container">
            Mention the opening date (could prepopulate with existing opening
            date if it exists)
          </label>
          <br />
          <DateTimePicker onChange={setOpeningDate} value={openingDate} />
          <br />

          <label className="small-container">
            Provide a few keywords to describe your location
          </label>
          <br />
          <input
            value={locationKeyWords}
            onChange={(event) => setLocationKeyWords(event.target.value)}
            placeholder="Brick building, scenic views, patio dining, next to the Hudson River"
            className="input-bar"
          />
          <br />

          <label className="small-container">Style</label>
          <br />
          <input
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            placeholder="eg. Funny or Clever, etc"
            className="input-bar"
          />

          <h4>Providers</h4>

          <input
            className="small-container"
            type="checkbox"
            defaultChecked={optimizeGoogle}
            onChange={() => setOptimizeGoogle(!optimizeGoogle)}
          />
          <label>Google (225 to 750 characters)</label>
          <br />

          <input
            className="small-container"
            type="checkbox"
            defaultChecked={optimizeFacebook}
            onChange={() => setOptimizeFacebook(!optimizeFacebook)}
          />
          <label>Facebook (Up to 155 characters)</label>
          <br />

          <input
            className="small-container"
            type="checkbox"
            defaultChecked={optimizeApple}
            onChange={() => setOptimizeApple(!optimizeApple)}
          />
          <label>Apple (5 to 500 characters)</label>
          <br />
          <br />
        </div>
      ) : (
        <div className="container">
          <table>
            <tbody>
              <tr>
                <td>
                  <h4>Original Google Business Description</h4>
                  <span>{googleOriginalBusinessDescription}</span>
                </td>
                <td>
                  <h4>Optimized Google Business Description</h4>
                  <textarea rows={10} cols={50}
                     value={googleOptimizedBusinessDescription}
                    onChange={(event) =>
                      setGoogleOptimizedBusinessDescription(event.target.value)
                    }
                  />
                  {googleOptimizedBusinessDescription.length}
                </td>
                <td>
                <button>Cancel</button>
                <button>Save</button>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>Original Apple Business Description</h4>
                  <span>{appleOriginalBusinessDescription}</span>
                </td>
                <td>
                  <h4>Optimized Apple Business Description</h4>
                  <textarea rows={10} cols={50} value={appleOptimizedBusinessDescription} onChange={(event) =>
                      setAppleOptimizedBusinessDescription(event.target.value)
                    } />
                    {appleOptimizedBusinessDescription.length}
                </td>
                <td>
                <button>Cancel</button>
                <button>Save</button>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>Original Facebook Business Description</h4>
                  <span>{facebookOriginalBusinessDescription}</span>
                </td>
                <td>
                  <h4>Optimized Facebook Business Description</h4>
                  <textarea rows={10} cols={50} value={facebookOptimizedBusinessDescription} onChange={(event) =>
                      setFacebookOptimizedBusinessDescription(event.target.value)
                    } />
                    {facebookOptimizedBusinessDescription.length}
                </td>
                <td>
                <button>Cancel</button>
                <button>Save</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={() => {
              setAppleOptimizedBusinessDescription("");
              setFacebookOptimizedBusinessDescription("");
              setGoogleOptimizedBusinessDescription("");
            }}
          >
            Back to edit
          </button>
        </div>
      )}
      <button type="submit" onClick={onSubmit}>
        Optimize
      </button>
      <div className="container" />
    </div>
  );
}

export default App;
