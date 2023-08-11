import React, { useEffect, useState } from "react";
import { CaptionTypes } from "./App";
import { Configuration, OpenAIApi } from "openai";
import DateTimePicker from "react-datetime-picker";

interface CaptionFormProps {
  captionType: CaptionTypes;
}

const CaptionForm = ({ captionType }: CaptionFormProps) => {
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);

  const [productOrService, setProductOrService] = useState("");
  const [productOrServiceaAdjectives, setProductOrServiceAdjectives] =
    useState("");
  const [offerDescription, setofferDescription] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventAdjectives, setEventAdjectives] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDateTime, setEventDateTime] = useState(new Date());

  const [organisationName, setOrganisationName] = useState("");
  const [values, setValues] = useState("");
  const [valuesDemonstration, setValuesDemonstration] = useState("");

  const [captionStyle, setCaptionStyle] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setCaption("");
    setCaptionStyle("")
  }, [captionType]);

  const onSubmit = async () => {
    var prompt = "";
    switch (captionType) {
      case CaptionTypes.NEWOFFER:
        prompt = `Create a ${captionStyle} social media caption that advertises ${productOrService} as ${productOrServiceaAdjectives} and 
            includes the offer: ${offerDescription}`;
        break;
      case CaptionTypes.NEWEVENT:
        prompt = `Create a ${captionStyle} social media caption that advertises a ${eventDescription} type of event with the event 
            name ${eventName} as ${eventAdjectives}, taking place at the location: ${eventLocation}, date: ${eventDateTime}`;
        break;
      case CaptionTypes.OURVALUES:
        prompt = `Create a ${captionStyle} social media caption that advertises ${organisationName} as demonstrating the values: ${values} 
            by ${valuesDemonstration}`;
        break;
    }
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1.0,
    });
    setCaption(completion.data.choices[0].text ?? "");
  };
  const submitButtonAndCaption = (
    <>
      <h5>Caption style (optional)</h5>
      <input
        value={captionStyle}
        onChange={(event) => setCaptionStyle(event.target.value)}
        placeholder="dramatic, subtle, mysterious, funny, etc."
        className="input-bar"
      />
      <br />
      <div className="container">
        <button onClick={onSubmit}>Generate Caption</button>
      </div>
      <br />
      <h5 style={{ margin: "0 auto", width: "80%", paddingBottom: "2rem" }}>
        {caption}
      </h5>
    </>
  );

  if (captionType === CaptionTypes.NEWOFFER) {
    return (
      <>
        <h5>Your product or service</h5>
        <input
          value={productOrService}
          onChange={(event) => setProductOrService(event.target.value)}
          placeholder="bagel bites, an oil change, etc."
          className="input-bar"
        />
        <h5>Insert adjectives of your product or service</h5>
        <input
          value={productOrServiceaAdjectives}
          onChange={(event) =>
            setProductOrServiceAdjectives(event.target.value)
          }
          placeholder="spicy, fast, crispy, etc."
          className="input-bar"
        />
        <h5>Input a brief description of the offer</h5>
        <input
          value={offerDescription}
          onChange={(event) => setofferDescription(event.target.value)}
          placeholder="buy 1 get 1 free, 30% off, etc."
          className="input-bar"
        />
        {submitButtonAndCaption}
      </>
    );
  } else if (captionType === CaptionTypes.NEWEVENT) {
    return (
      <>
        <h5>Your event's name</h5>
        <input
          value={eventName}
          onChange={(event) => setEventName(event.target.value)}
          placeholder="Hardrock's New Years Eve Party, etc."
          className="input-bar"
        />
        <h5>Insert adjectives of your event</h5>
        <input
          value={eventAdjectives}
          onChange={(event) => setEventAdjectives(event.target.value)}
          placeholder="hot, elegant, etc."
          className="input-bar"
        />
        <h5>Input a brief description of the event</h5>
        <input
          value={eventDescription}
          onChange={(event) => setEventDescription(event.target.value)}
          placeholder="music festival, comedy show, etc."
          className="input-bar"
        />
        <h5>Input a location</h5>
        <input
          value={eventLocation}
          onChange={(event) => setEventLocation(event.target.value)}
          placeholder="Palm Springs, California, etc."
          className="input-bar"
        />
        <h5>Input a date and time</h5>
        <DateTimePicker onChange={setEventDateTime} value={eventDateTime} />
        {submitButtonAndCaption}
      </>
    );
  } else if (captionType === CaptionTypes.OURVALUES) {
    return (
      <>
        <h5>Name of your organisation</h5>
        <input
          value={organisationName}
          onChange={(event) => setOrganisationName(event.target.value)}
          placeholder="Starbucks, Yogabox, etc."
          className="input-bar"
        />
        <h5>Your Value(s)</h5>
        <input
          value={values}
          onChange={(event) => setValues(event.target.value)}
          placeholder="inclusivity, simplicity and authenticity, ingenuity, diversity and respect, etc."
          className="input-bar"
        />
        <h5>How are you demonstrating this/these values?</h5>
        <input
          value={valuesDemonstration}
          onChange={(event) => setValuesDemonstration(event.target.value)}
          placeholder="inclusivity, simplicity, ingenuity, respect, diversity, etc."
          className="input-bar"
        />
        {submitButtonAndCaption}
      </>
    );
  }
  return <></>;
};

export default CaptionForm;
