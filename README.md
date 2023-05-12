# llm.ts

Call 30+ LLMs with a single API. 
* Send multiple prompts to multiple LLMs and get the results back in a single response.
* Zero dependencies (under 10kB minified)
* Bring your own API keys
* Works anywhere (Node, Deno, browser)

### Install
#### npm
```bash
npm install llm.ts
```
#### yarn
```bash
yarn add llm.ts
```

### [Example](examples/simple)
```typescript
import { LLM, MODEL } from 'llm.ts';

(async function () {
    await new LLM({
        apiKeys: {
            openAI: process.env.OPENAI_API_KEY ?? '',
            cohere: process.env.COHERE_API_KEY ?? '',
            huggingface: process.env.HF_API_TOKEN ?? '',
        }
    }).completion({
        prompt: [
            'Repeat the following sentence: "I am a robot."',
            'Repeat the following sentence: "I am a human."',
        ],
        model: [
            // use the model name
            'text-ada-001',

            // or specify a specific provider
            'cohere/command-nightly',

            // or use enums to avoid typos
            MODEL.HF_GPT2,
        ],
    }).then(resp => {
        console.log(resp);
    })
})()
```
```json
{
  "created": 1683079463217,
  "choices": [
    {
      "text": "\n\nI am a robot.",
      "index": 0,
      "model": "text-ada-001",
      "promptIndex": 0,
      "created": 1683079462
    },
    {
      "text": "\n\nI am a human.",
      "index": 1,
      "model": "text-ada-001",
      "promptIndex": 1,
      "created": 1683079462
    },
    {
      "text": "\nI am a robot.",
      "index": 2,
      "model": "command-nightly",
      "promptIndex": 0,
      "created": 1683079463217
    },
    {
      "text": "\nI am a human.",
      "index": 3,
      "model": "command-nightly",
      "promptIndex": 1,
      "created": 1683079463216
    },
    {
      "text": " \"Is that your question? I was expecting the answer.\" \"Then why do you think you are being asked!\" 1. \"What are you?\" \"What are you?\" \"Why are you",
      "index": 4,
      "model": "gpt2",
      "promptIndex": 0,
      "created": 1683079463088
    },
    {
      "text": " — this quote is most often cited in reference to the Qur'an. (e.g. Ibn `Allaahu `udayyyih, Al-Rai`an, Al",
      "index": 5,
      "model": "gpt2",
      "promptIndex": 1,
      "created": 1683079463091
    }
  ]
}
```


### Models supported (want to add one, open a PR!):
* text-ada-001
* text-babbage-001
* text-curie-001
* text-davinci-002
* text-davinci-003
* cohere-command
* cohere-command-nightly
* cohere-command-light
* cohere-command-light-nightly
* gpt2
* bloom-1b
* bloom-3b
* bloom-7b1
* llama-7b
* llama-13b
* llama-30b
* llama-65b
* gptj-6b
* gptj-2.7b
* gpt-neo-125m
* gpt-neo-1.3b
* gpt-neo-20b
* cerebras-gpt-111m
* cerebras-gpt-1.3b
* cerebras-gpt-2.7b
* santacoder
* codegen-350m
* codegen-2b
* stablelm-tuned-3b
* stablelm-tuned-7b
* pythia-70m
* pythia-160m
* pythia-12b
* distilgpt2

### Hosting providers supported (want to add one, open a PR!):
* OpenAI
* Cohere
* HuggingFace

### License
MIT