import { pipeline, TextStreamer } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.2.1';

const gen = async () => {
  const gpt = await pipeline('text-generation', 'Xenova/llama2.c-stories15M')
  const gptStart = Date.now();
  let t = ''
  const streamer = new TextStreamer(gpt.tokenizer, {
	  skip_prompt: true,
	  callback_function: (text) => {
		  t += text
		  self.postMessage({status: 'update', t: t.trim()})
	  }
  })
  const r = await gpt('<s>', { streamer, do_sample: true, max_new_tokens: 100 })
  const elapsed = (Date.now() - gptStart) / 1000;
  const cps = t.length / elapsed;
  const speed = isNaN(cps) ? 0 : cps.toFixed(2)
  self.postMessage({status: 'speed', speed})
}
gen()
