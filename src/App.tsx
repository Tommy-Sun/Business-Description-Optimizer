import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import CaptionForm from "./CaptionForm";
import DateTimePicker from "react-datetime-picker";
import { Configuration, OpenAIApi } from "openai";

export enum CaptionTypes {
  NEWOFFER = "New Offer",
  NEWEVENT = "New Event",
  OURVALUES = "Our Values As An Organisation",
}

function App() {
  const originalBusinessDescription = `Experience the delight of custom-made coffee at your local 7-Eleven, your go-to destination for coffee nearby. At 7-Eleven, we understand that everyone's coffee preference is unique. That's why our self-serve coffee stations are designed to let you craft your perfect cup of coffee. In addition to being your local hub for the best coffee nearby, we offer a broad selection of fresh, high-quality products at an everyday fair price. Furthermore, our fast, convenient, and delicious hot foods are designed to cater to any craving, ensuring that your on-the-go meals are always satisfying. Don't forget to text '7Rewards' to 711711 to download the 7-Eleven app and join 7Rewards for exclusive perks and promotions.`;
  const address = "30 N. SUMMERLIN AVE, Orlando, FL. USA";
  const primaryCategory = "Convenience Store";
  const businessName = "7-eleven";

  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);

  const [captionTypeSelected, setCaptionTypeSelected] = useState(
    CaptionTypes.NEWOFFER
  );

  const [locationKeyWords, setLocationKeyWords] = useState("");
  const [highValueProducts, setHighValueProducts] = useState("");
  const [style, setStyle] = useState("");
  const [openingDate, setOpeningDate] = useState(new Date());
  const [mentionPrimaryBusiness, setMentionPrimaryBusiness] = useState(false);
  const [optimizeGoogle, setOptimizeGoogle] = useState(false);
  const [optimizeFacebook, setOptimizeFacebook] = useState(false);
  const [optimizeApple, setOptimizeApple] = useState(false);
  const [optimizedBusinessDescription, setOptimizedBusinessDescription] = useState("");
  console.log("optimized business description: ", optimizedBusinessDescription)

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

    let prompt = `Rewrite and shorten the following business description: {${originalBusinessDescription}}. Make sure to use the business name: ${businessName} and include appropriate parts of the ${address} and taking into account the category ${primaryCategory}. The output should be a business description between 250 and 750 characters long`;
    
    if(locationKeyWords.length > 0) {prompt += ` Make sure to include the following keywords: ${locationKeyWords}. Place them towards the beginning of the description`};

    if(highValueProducts.length > 0) {prompt += ` Make sure to include a mention of one or more of the high value products: ${highValueProducts}`};
    
    if(openingDate != null) {prompt += ` Make sure to include a mention of when the business opened on: ${openingDate.getMonth()}/${openingDate.getDate()}/${openingDate.getFullYear()}`};
    
    if(style.length > 0){prompt += ` Make it in the style ${style}.`}

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 180,
      temperature: 1.0,
    });
    const response = completion.data.choices[0].message?.content ?? ""
    console.log(response.length)
    
    setOptimizedBusinessDescription(response);
  };

  return (
    <div className="App">
      <h2 className="header">Optimize Business Description with AI</h2>
      {optimizedBusinessDescription.length === 0 ? (
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
          <button type="submit" onClick={onSubmit}>
            Optimize
          </button>
        </div>
      ) : (
        <div className="container">
          <table>
            <tbody>

            <tr>
              <td>
            <h4>Original Business Description</h4>
            <span>{originalBusinessDescription}</span>
              </td>
              <td>
              <h4>Optimized Business Description</h4>
            <span>{optimizedBusinessDescription}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
