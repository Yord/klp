![klp teaser][teaser]

:horse:`klp` (Kelpie) is a small, fast, and magical command-line data processor similar to `pxi`, `jq`, `mlr`, and `awk`.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

Installation is done using [`npm`][npm-install].

```bash
$ npm i -g klp
```

Try `klp --help` to see if the installation was successful.

## Features

+   :penguin: **Small:** Kelpie [does one thing and does it well][unix-philosophy] (processing data with JavaScript).
+   :zap: **Fast:** `klp` is as fast as `pxi` and `gawk`, 3x faster than `jq` and `mlr`, and 15x faster than `fx`.
+   :sparkles: **Magical:** It is trivial to write your own ~~spells~~ *plugins*.
+   :smile_cat: **Playful:** Opt-in to more data formats by installing plugins.
+   :tada: **Versatile:** Use Ramda, Lodash and any other JavaScript library to process data on the command-line.
+   :heart: **Loving:** Pixie is made with love and encourages a positive and welcoming environment.

## Getting Started

<details open>
<summary>
Kelpie reads in big structured text files, transforms them with JavaScript functions, and writes them back to disk.
The usage examples in this section are based on the following large <a href="https://jsonlines.org">JSONL</a> file.
Inspect the examples by clicking on them!

<p>

```bash
$ head -5 2019.jsonl # 2.6GB, 31,536,000 lines
```

</p>
</summary>

```json
{"time":1546300800,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}
{"time":1546300801,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":1}
{"time":1546300802,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":2}
{"time":1546300803,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":3}
{"time":1546300804,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":4}
```

</details>

<details>
<summary>
Execute any JavaScript function:

<p>

```bash
$ klp --with map "json => json.time" < 2019.jsonl
$ klp --with map "({time}) => time" < 2019.jsonl
```

</p>
</summary>

You may use JavaScript arrow functions, destructuring, spreading,
and any other feature of your current NodeJS version.

```json
1546300800
1546300801
1546300802
1546300803
1546300804
```

</details>

<details>
<summary>
Convert between JSON, CSV, SSV, and TSV:

<p>

```bash
$ klp --from json --to csv < 2019.jsonl > 2019.csv
```

</p>
</summary>

Users may extend Kelpie with (third-party) plugins for many more data formats.
See the [`.klp` module section][klp-module] on how to do that and the [plugins](#plugins) section for a list.
Kelpie chunks data into tokens (`--by`), deserializes tokens into JSON (`--from`), applies functions (`--with`) and serializes JSON to another format (`--to`).

```json
time,year,month,day,hours,minutes,seconds
1546300800,2019,1,1,0,0,0
1546300801,2019,1,1,0,0,1
1546300802,2019,1,1,0,0,2
1546300803,2019,1,1,0,0,3
```

</details>

<details>
<summary>
Use Ramda, Lodash or any other JavaScript library:

<p>

```bash
$ klp --from csv --with map "o(obj => _.omit(obj, ['seconds']), evolve({time: parseInt}))" < 2019.csv
```

</p>
</summary>

Kelpie may use any JavaScript library, including Ramda and Lodash.
Read the [`.klp` module section][klp-module] to learn more.

```json
{"time":1546300800,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0"}
{"time":1546300801,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0"}
{"time":1546300802,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0"}
{"time":1546300803,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0"}
{"time":1546300804,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0"}
```

</details>

<details>
<summary>
Process data streams from REST APIs and other sources and pipe Kelpie's output to other commands:

<p>

```bash
$ curl -s "https://swapi.co/api/films/" |
  klp --with flatMap 'json => json.results' --to json --keep '["episode_id", "title"]' |
  sort
```

</p>
</summary>

Kelpie follows the [unix philosophy][unix-philosophy]:
It does one thing (processing structured data), and does it well.
It is written to work together with other programs and it handles text streams because that is a universal interface.

```json
{"episode_id":1,"title":"The Phantom Menace"}
{"episode_id":2,"title":"Attack of the Clones"}
{"episode_id":3,"title":"Revenge of the Sith"}
{"episode_id":4,"title":"A New Hope"}
{"episode_id":5,"title":"The Empire Strikes Back"}
{"episode_id":6,"title":"Return of the Jedi"}
{"episode_id":7,"title":"The Force Awakens"}
```

</details>

<details>
<summary>
Use Kelpies's ssv deserializer to work with command line output:

<p>

```bash
$ ls -ahl / | klp --from ssv --with map '([,,,,size,,,,file]) => ({size, file})'
```

</p>
</summary>

Kelpie's space-separated values deserializer makes it very easy to work with the output of other commands.
Array destructuring is especially helpful in this area.

```json
{"size":"704B","file":"."}
{"size":"704B","file":".."}
{"size":"1.2K","file":"bin"}
{"size":"4.4K","file":"dev"}
{"size":"11B","file":"etc"}
{"size":"25B","file":"home"}
{"size":"64B","file":"opt"}
{"size":"192B","file":"private"}
{"size":"2.0K","file":"sbin"}
{"size":"11B","file":"tmp"}
{"size":"352B","file":"usr"}
{"size":"11B","file":"var"}
```

</details>

See the [usage](#usage) section below for more examples.

### Introductory Blogposts

For a quick start, read the following blog posts:

+   TODO

## :horse: Kelpie

Kelpie's philosophy is to provide a small, extensible frame
for processing large files and streams with JavaScript functions.
Different data formats are supported through plugins.
JSON, CSV, SSV, and TSV are supported by default, but users can customize their Kelpie
installation by picking and choosing from more available (including third-party) plugins.

Kelpie works its magic by chunking, deserializing, applying functions, and serializing data.
Expressed in code, it works like this:

```javascript
function klp (data) {                // Data is passed to klp from stdin.
  const chunks = chunk(data)         // The data is chunked into tokens
  const jsons  = deserialize(chunks) // The tokens are deserialized into JSON objects. 
  const jsons2 = transform(jsons)    // Each JSON object is transformed to a different JSON object.
  const string = serialize(jsons2)   // The new JSON objects are serialized to a string.
  process.stdout.write(string)       // The string is written to stdout.
}
```

For example, chunking, deserializing, and serializing JSON is provided by the [`klp-json`][klp-json] plugin.

### Plugins

The following plugins are available:

|                            | Chunkers  | Deserializers              | Appliers                   | Serializers                | `klp` |
|----------------------------|-----------|----------------------------|----------------------------|----------------------------|:-----:|
| [`klp-core`][klp-core]     | `line`    |                            | `map`, `flatMap`, `filter` | `string`                   |   ✓   |
| [`klp-json`][klp-json]     | `jsonObj` | `json`                     |                            | `json`                     |   ✓   |
| [`klp-dsv`][klp-dsv]       |           | `csv`, `tsv`, `ssv`, `dsv` |                            | `csv`, `tsv`, `ssv`, `dsv` |   ✓   |
| [`klp-sample`][klp-sample] | `sample`  | `sample`                   | `sample`                   | `sample`                   |   ✕   |

The last column states which plugins come preinstalled in `klp`.
Refer to the `.klp` Module section to see how to enable more plugins and how to develop plugins.
New experimental pixie plugins are developed i.a. in the [`klp-sandbox`][klp-sandbox] repository.

### Performance

`klp` is very fast and beats several similar tools in [performance benchmarks][klp-benchmarks].
Times are given in CPU time (seconds), wall-clock times may deviate by ± 1s.
The benchmarks were run on a 13" MacBook Pro (2019) with a 2,8 GHz Quad-Core i7 and 16GB memory.
Feel free to run the [benchmarks][klp-benchmarks] on your own machine
and if you do, please [open an issue][issues] to report your results!

| [Benchmark][klp-benchmarks] | Description                                   | `klp` | `pxi` | `gawk` | `jq` | `mlr` | `fx` |
|-----------------------------|-----------------------------------------------|------:|------:|-------:|-----:|------:|-----:|
| **JSON 1**                  | Select an attribute on small JSON objects     |   11s |   11s |    15s |  46s |     – | 284s |
| **JSON 2**                  | Select an attribute on large JSON objects     |   20s |   20s |    20s |  97s |     – | 301s |
| **JSON 3**                  | Pick a single attribute on small JSON objects |   15s |   15s |    21s |  68s |   91s | 368s |
| **JSON 4**                  | Pick a single attribute on large JSON objects |   26s |   26s |    27s | 130s | 257s† | 420s |
| **JSON to CSV 1**           | Convert a small JSON to CSV format            |   15s |   15s |      – |  77s |   60s |    – |
| **JSON to CSV 2**           | Convert a large JSON to CSV format            |   38s |   38s |      – | 264s | 237s† |    – |
| **CSV 1**                   | Select a column from a small csv file         |   11s |   11s |     8s |  37s |   23s |    – |
| **CSV 2**                   | Select a column from a large csv file         |   19s |   19s |     9s |  66s |   72s |    – |
| **CSV to JSON 1**           | Convert a small CSV to JSON format            |   15s |   15s |      – |    – |  120s |    – |
| **CSV to JSON 2**           | Convert a large CSV to JSON format            |   42s |   42s |      – |    – |  352s |    – |

† `mlr` appears to load the whole file instead of processing it in chunks if reading JSON.
This is why it fails on large input files.
So in these benchmarks, the first 20,000,000 lines are processed first, followed by the remaining 11,536,000 lines.
The times of both runs are summed up.

<details>
<summary>
<code>klp</code>, <code>pxi</code> (Kelpie's predecessor) and <code>gawk</code> notably beat
<code>jq</code>, <code>mlr</code>, and <code>fx</code> in every benchmark.
However, due to its different data processing approach, <code>klp</code> is more versatile than <code>gawk</code>
and is e.g. able to transform data formats into another.
For a more detailed interpretation, open this box.
</summary>
<p>

`klp` and `gawk` differ greatly in their approaches to transforming data:
While `gawk` manipulates strings, `klp` parses data according to a format, builds an internal JSON representation,
manipulates this JSON, and serializes it to a different format.
Surprisingly, they perform equally well in the benchmarks,
with `klp` being a little faster in JSON and `gawk` in CSV.
However, the more attributes JSON objects have and the more columns CSV files have,
the faster `gawk` gets compared to `klp`, because it does not need to build an internal data representation.
On the other hand, while `klp` is able to perform complex format transformations,
`gawk` is unable to do it because of its different approach.

`jq` and `mlr` share `klp`'s data transformation approach, but focus on different formats:
While `jq` specializes in transforming JSON, `mlr`'s focus is CSV.
Although `klp` does not prefer one format over the other,
it beats both tools in processing speed on their preferred formats.

`fx` and `klp` are very similar in that both are written in JavaScript and use JavaScript as their processing language.
However, although `fx` specializes in just the JSON format, `klp` is at least 15x faster in all benchmarks.

All tools differ in their memory needs.
Since `klp` and `fx` are written in an interpreted language, they need approx. 70 MB due to their runtime.
Since `gawk` and `jq` are compiled binaries, they only need approx. 1MB.
`mlr` needs the most memory (up to 11GB), since it appears to load the whole file before processing it in some cases.

</p>
</details>

## Usage

<details open>
<summary>
The examples in this section are based on the following big JSONL file.
Inspect the examples by clicking on them!

<p>

```bash
$ head -5 2019.jsonl # 2.6GB, 31,536,000 lines
```

</p>
</summary>

```json
{"time":1546300800,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":0}
{"time":1546300801,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":1}
{"time":1546300802,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":2}
{"time":1546300803,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":3}
{"time":1546300804,"year":2019,"month":1,"day":1,"hours":0,"minutes":0,"seconds":4}
```

</details>

<details>
<summary>
Select the time:

<p>

```bash
$ klp --with map "json => json.time" < 2019.jsonl
```

</p>
</summary>

Go ahead and use JavaScript's arrow functions.

```json
1546300800
1546300801
1546300802
1546300803
1546300804
```

</details>

<details>
<summary>
Select month and day:

<p>

```bash
$ klp --with map '({month, day}) => ({month, day})' < 2019.jsonl
```

</p>
</summary>

Use destructuring and spread syntax.

```json
{"month":1,"day":1}
{"month":1,"day":1}
{"month":1,"day":1}
{"month":1,"day":1}
{"month":1,"day":1}
```

</details>

<details>
<summary>
Convert JSON to CSV:

<p>

```bash
$ klp --from json --to csv < 2019.jsonl > 2019.csv
```

</p>
</summary>

Kelpie has deserializers (`--from`) and serializers (`--to`) for various data formats, including JSON and CSV.
JSON is the default deserializer and serializer, so no need to type `--from json` and `--to json`.

```json
time,year,month,day,hours,minutes,seconds
1546300800,2019,1,1,0,0,0
1546300801,2019,1,1,0,0,1
1546300802,2019,1,1,0,0,2
1546300803,2019,1,1,0,0,3
1546300804,2019,1,1,0,0,4
```

</details>

<details>
<summary>
Convert JSON to CSV, but keep only time and month:

<p>

```bash
$ klp --with map '({time, month}) => [time, month]' --to csv < 2019.jsonl
```

</p>
</summary>

Serializers can be freely combined with functions.

```json
1546300800,1
1546300801,1
1546300802,1
1546300803,1
1546300804,1
```

</details>

<details>
<summary>
Rename time to timestamp and convert CSV to TSV:

<p>

```bash
$ klp --from csv --with map '({time, ...rest}) => ({timestamp: time, ...rest})' --to tsv < 2019.csv
```

</p>
</summary>

Read in CSV format.
Use destructuring to select all attributes other than time.
Rename time to timestamp and keep all other attributes unchanged.
Write in TSV format.

```json
timestamp       year    month   day     hours   minutes seconds
1546300800      2019    1       1       0       0       0
1546300801      2019    1       1       0       0       1
1546300802      2019    1       1       0       0       2
1546300803      2019    1       1       0       0       3
1546300804      2019    1       1       0       0       4
```

</details>

<details>
<summary>
Convert CSV to JSON:

<p>

```bash
$ klp --from csv --to json < 2019.csv
```

</p>
</summary>

```json
{"time":"1546300800","year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"0"}
{"time":"1546300801","year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"1"}
{"time":"1546300802","year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"2"}
{"time":"1546300803","year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"3"}
{"time":"1546300804","year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"4"}
```

</details>

<details>
<summary>
Convert CSV to JSON and cast time to integer:

<p>

```bash
$ klp --from csv --with map '({time, ...rest}) => ({time: parseInt(time), ...rest})' < 2019.csv
```

</p>
</summary>

Deserializing from CSV does not automatically cast strings to other types.
This is intentional, since some use cases may need casting, and others don't.
If you need a key to be an integer, you need to explicitly transform it.

```json
{"time":1546300800,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"0"}
{"time":1546300801,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"1"}
{"time":1546300802,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"2"}
{"time":1546300803,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"3"}
{"time":1546300804,"year":"2019","month":"1","day":"1","hours":"0","minutes":"0","seconds":"4"}
```

</details>

<details>
<summary>
Use Ramda (or Lodash):

<p>

```bash
$ klp --from csv --with map 'evolve({year: parseInt, month: parseInt, day: parseInt})' < 2019.csv
```

</p>
</summary>

Kelpie may use any JavaScript library, including Ramda and Lodash.
The [`.klp` module section][klp-module] tells you how to install them.

```json
{"time":"1546300800","year":2019,"month":1,"day":1,"hours":"0","minutes":"0","seconds":"0"}
{"time":"1546300801","year":2019,"month":1,"day":1,"hours":"0","minutes":"0","seconds":"1"}
{"time":"1546300802","year":2019,"month":1,"day":1,"hours":"0","minutes":"0","seconds":"2"}
{"time":"1546300803","year":2019,"month":1,"day":1,"hours":"0","minutes":"0","seconds":"3"}
{"time":"1546300804","year":2019,"month":1,"day":1,"hours":"0","minutes":"0","seconds":"4"}
```

</details>

<details>
<summary>
Select only May the 4th:

<p>

```bash
$ klp --with filter '({month, day}) => month == 5 && day == 4' < 2019.jsonl
```

</p>
</summary>

Appliers determine how functions are applied.
The default applier is `map`, which applies the function to each element.
Here, we use the `filter` applier that keeps only elements for which the function yields true.

```json
{"time":1556928000,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":0}
{"time":1556928001,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":1}
{"time":1556928002,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":2}
{"time":1556928003,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":3}
{"time":1556928004,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":4}
```

</details>

<details>
<summary>
Use more than one function:

<p>

```bash
$ klp --with filter '({month}) => month == 5' filter '({day}) => day == 4' < 2019.jsonl
```

</p>
</summary>

Functions are applied in the given order on an element to element basis.
In this case, each element is first checked for the month, then for the day.

```json
{"time":1556928000,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":0}
{"time":1556928001,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":1}
{"time":1556928002,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":2}
{"time":1556928003,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":3}
{"time":1556928004,"year":2019,"month":5,"day":4,"hours":0,"minutes":0,"seconds":4}
```

</details>

<details>
<summary>
Keep only certain keys and pretty-print JSON:

<p>

```bash
$ klp --to json --keep '["time"]' --spaces 2 < 2019.jsonl > pretty.jsonl
```

</p>
</summary>

The `--keep` attribute takes a stringified JSON array and narrows each element to only the keys in it.
Using `--spaces` with any value other than `0` formats the serialized JSON using the provided number as spaces.


```json
{
  "time": 1546300800
}
{
  "time": 1546300801
}
{
  "time": 1546300802
}
{
  "time": 1546300803
}
{
  "time": 1546300804
}
```

</details>

<details>
<summary>
Deserialize JSON that is not given line by line:

<p>

```bash
$ klp --by jsonObj < pretty.jsonl
```

</p>
</summary>

The `--by` attribute defines how data is turned into chunks that are deserialized.
The default chunker is `line` which treats each line as a chunk.
In cases where JSON is not given line by line, e.g. if it is pretty-printed, the `jsonObj` chunker helps.

```json
{"time":1546300800}
{"time":1546300801}
{"time":1546300802}
{"time":1546300803}
{"time":1546300804}
```

</details>

<details>
<summary>
Suppose you have to access a web API:

<p>

```bash
$ curl -s "https://swapi.co/api/people/"
```

</p>
</summary>

The returned JSON is one big mess and needs to be tamed.

```json
{"count":87,"next":"...","results":[{"name":"Luke Skywalker","height":"172","mass":"77" [...]
```

</details>

<details>
<summary>
Use Kelpie to organize the response:

<p>

```bash
$ curl -s "https://swapi.co/api/people/" |
  klp --with flatMap "json => json.results" --to json --keep '["name","height","mass"]'
```

</p>
</summary>

Here, the function selects the results array.
If it were applied with `map`, it would return the whole array as an element.
But since we use `flatMap`, each array item is returned as an element, instead.
The `--keep` attribute specifies, which keys to keep from the returned objects:

```json
{"name":"Luke Skywalker","height":"172","mass":"77"}
{"name":"C-3PO","height":"167","mass":"75"}
{"name":"R2-D2","height":"96","mass":"32"}
{"name":"Darth Vader","height":"202","mass":"136"}
{"name":"Leia Organa","height":"150","mass":"49"}
{"name":"Owen Lars","height":"178","mass":"120"}
{"name":"Beru Whitesun lars","height":"165","mass":"75"}
{"name":"R5-D4","height":"97","mass":"32"}
{"name":"Biggs Darklighter","height":"183","mass":"84"}
{"name":"Obi-Wan Kenobi","height":"182","mass":"77"}
```

</details>

<details>
<summary>
Compute all Star Wars character's <a href="https://en.wikipedia.org/wiki/Body_mass_index">BMI</a>:

<p>

```bash
$ curl -s "https://swapi.co/api/people/" |
  klp --with flatMap "json => json.results" --to json --keep '["name","height","mass"]' |
  klp --with map "ch => (ch.bmi = ch.mass / (ch.height / 100) ** 2, ch)" --to json --keep '["name","bmi"]'
```

</p>
</summary>

We use Kelpie to compute each character's BMI.
The default `line` chunker is suitable to apply a BMI-computing function to each line.
Before serializing to the default format JSON, we only keep the name and bmi fields.
`map` supports mutating function inputs, which might be a problem for other appliers, so be careful.

```json
{"name":"Luke Skywalker","bmi":26.027582477014604}
{"name":"C-3PO","bmi":26.89232313815483}
{"name":"R2-D2","bmi":34.72222222222222}
{"name":"Darth Vader","bmi":33.33006567983531}
{"name":"Leia Organa","bmi":21.77777777777778}
{"name":"Owen Lars","bmi":37.87400580734756}
{"name":"Beru Whitesun lars","bmi":27.548209366391188}
{"name":"R5-D4","bmi":34.009990434690195}
{"name":"Biggs Darklighter","bmi":25.082863029651524}
{"name":"Obi-Wan Kenobi","bmi":23.24598478444632}
```

</details>

<details>
<summary>
Identify all obese Star Wars characters:

<p>

```bash
$ curl -s "https://swapi.co/api/people/" |
  klp --with flatMap "json => json.results" --to json --keep '["name","height","mass"]' |
  klp --with map "ch => (ch.bmi = ch.mass / (ch.height / 100) ** 2, ch)" --to json --keep '["name","bmi"]' |
  klp --with filter "ch => ch.bmi >= 30" --to json --keep '["name"]'
```

</p>
</summary>

Finally, we use `filter` to identify obese characters and keep only their names.

```json
{"name":"R2-D2"}
{"name":"Darth Vader"}
{"name":"Owen Lars"}
{"name":"R5-D4"}
```

As it turns out, Anakin could use some training.

</details>

<details>
<summary>
Select PID and CMD from <code>ps</code>:

<p>

```bash
$ ps | klp --from ssv --with map '([pid, tty, time, cmd]) => ({pid, cmd})'
```

</p>
</summary>

Kelpie supports space-separated values, which is perfect for processing command line output.

```json
{"pid":"42978","cmd":"-zsh"}
{"pid":"42988","cmd":"-zsh"}
{"pid":"43006","cmd":"-zsh"}
{"pid":"43030","cmd":"-zsh"}
{"pid":"43067","cmd":"-zsh"}
```

</details>

<details>
<summary>
Select file size and filename from <code>ls</code>:

<p>

```bash
$ ls -ahl / | klp --from ssv --with map '([,,,,size,,,,file]) => ({size, file})'
```

</p>
</summary>

Array destructuring is especially useful when working with space-separated values.

```json
{"size":"704B","file":"."}
{"size":"704B","file":".."}
{"size":"1.2K","file":"bin"}
{"size":"4.4K","file":"dev"}
{"size":"11B","file":"etc"}
{"size":"25B","file":"home"}
{"size":"64B","file":"opt"}
{"size":"192B","file":"private"}
{"size":"2.0K","file":"sbin"}
{"size":"11B","file":"tmp"}
{"size":"352B","file":"usr"}
{"size":"11B","file":"var"}
```

</details>

<details>
<summary>
Allow JSON objects and lists in CSV:

<p>

```bash
$ echo '{"a":1,"b":[1,2,3]}\n{"a":2,"b":{"c":2}}' |
  klp --to csv --no-fixed-length --allow-list-values
```

</p>
</summary>

Kelpie may be told to allow JSON encoded lists and objects in CSV files.
Note, how Kalpie takes care of quoting and escaping those values for you.

```json
a,b
1,"[1,2,3]"
2,"{""c"":2}"
```

</details>

<details>
<summary>
Decode JSON values in CSV:

<p>

```bash
$ echo '{"a":1,"b":[1,2,3]}\n{"a":2,"b":{"c":2}}' |
  klp --to csv --no-fixed-length --allow-list-values |
  klp --from csv --with map 'evolve({b: JSON.parse})'
```

</p>
</summary>

JSON values are treated as strings and are not automatically parsed.
This is intentional, as Kelpie tries to keep as much out of your way as possible.
They can be transformed back into JSON by applying JSON.parse in a function.

```json
{"a":"1","b":[1,2,3]}
{"a":"2","b":{"c":2}}
```

</details>

## `.klp` Module

Users may extend and modify `klp` by providing a `.klp` module.
If you wish to do that, create a `~/.klp/index.js` file and insert the following base structure:

```js
module.exports = {
  plugins:  [],
  context:  {},
  defaults: {}
}
```

The following sections will walk you through all capabilities of `.klp` modules.
If you want to skip over the details and instead see sample code, visit [`klp-klp`][klp-klp]!

### Writing Plugins

You may write pixie plugins in `~/.klp/index.js`.
Writing your own extensions is straightforward:

```js
const sampleChunker = {
  name: 'sample',
  desc: 'is a sample chunker.',
  func: ({verbose}) => (data, prevLines, noMoreData) => (
    // * Turn data into an array of chunks
    // * Count lines for better error reporting throughout klp
    // * Collect error reports: {msg: String, line: Number, info: String}
    //   If verbose > 0, include line in error reports
    //   If verbose > 1, include info in error reports
    // * Return errors, chunks, lines, the last line, and all unchunked data
    {err: [], chunks: [], lines: [], lastLine: 0, rest: ''}
  )
}

const sampleDeserializer = {
  name: 'sample',
  desc: 'is a sample deserializer.',
  func: ({verbose}) => (chunks, lines) => (
    // * Deserialize chunks to jsons
    // * Collect error reports: {msg: String, line: Number, info: Chunk}
    //   If verbose > 0, include line in error reports
    //   If verbose > 1, include info in error reports
    // * Return errors and deserialized jsons
    {err: [], jsons: []}
  )
}

const sampleApplier = {
  name: 'sample',
  desc: 'is a sample applier.',
  func: ({verbose}) => (jsons, lines) => (
    // * Turn jsons into other jsons by applying all functions
    // * Collect error reports: {msg: String, line: Number, info: Json}
    //   If verbose > 0, include line in error reports
    //   If verbose > 1, include info in error reports
    // * Return errors and serialized string
    {err: [], jsons: []}
  )
}

const sampleSerializer = {
  name: 'sample',
  desc: 'is a sample serializer.',
  func: ({verbose}) => jsons => (
    // * Turn jsons into a string
    // * Collect error reports: {msg: String, line: Number, info: Json}
    //   If verbose > 0, include line in error reports
    //   If verbose > 1, include info in error reports
    // * Return errors and serialized string
    {err: [], str: ''}
  )
}
```

The `name` is used by Kelpie to select your extension,
the `desc` is displayed in the options section of `klp --help`, and
the `func` is called by Kelpie to transform data.

The sample extensions are bundled to the sample plugin, as follows:

```js
const sample = {
  chunkers:      [sampleChunker],
  deserializers: [sampleDeserializer],
  appliers:      [sampleApplier],
  serializers:   [sampleSerializer]
}
```

### Extending Kelpie with Plugins

Plugins can come from two sources:
They are either written by the user, as shown in the previous section, or they are installed in `~/.klp/` as follows:

```bash
$ npm install klp-sample
```

If a plugin was installed, it has to be imported into `~/.klp/index.js`:

```js
const sample = require('klp-sample')
```

Regardless of whether a plugin was defined by a user or installed from `npm`,
all plugins are added to the `.klp` module the same way:

```js
module.exports = {
  plugins:  [sample],
  context:  {},
  defaults: {}
}
```

`klp --help` should now list the chunkers, deserializers, appliers and serializers of the sample plugin extensions
in their respective sections.

> :speak_no_evil: Adding plugins may **break the `klp` command line tool**!
> If this happens, just remove the plugin from the list and `klp` should work normal again.
> Use this feature responsibly.

### Including Libraries like Ramda or Lodash

Libraries like [Ramda][ramda] and [Lodash][lodash] are of immense help when writing functions to transform JSON objects
and many heated discussions have been had, which of these libraries is superior.
Since different people have different preferences, pixie lets the user decide which library to use.

First, install your preferred libraries in `~/.klp/`:

```bash
$ npm install ramda
$ npm install lodash
```

Next, add the libraries to `~/.klp/index.js`:

```js
const R = require('ramda')
const L = require('lodash')

module.exports = {
  plugins:  [],
  context:  Object.assign({}, R, {_: L}),
  defaults: {}
}
```

You may now use all Ramda functions without prefix, and all Lodash functions with prefix `_`:

```bash
$ klp --with map "prop('time')" < 2019.jsonl
$ klp --with map "json => _.get(json, 'time')" < 2019.jsonl
```

> :hear_no_evil: Using Ramda and Lodash in your functions may have a **negative impact on performance**!
> Use this feature responsibly.

### Including Custom JavaScript Functions

Just as you may extend Kelpie with third-party libraries like Ramda and Lodash,
you may add your own functions.
This is as simple as adding them to the context in `~/.klp/index.js`:

```js
const getTime = json => json.time

module.exports = {
  plugins:  [],
  context:  {getTime},
  defaults: {}
}
```

After adding it to the context, you may use your function:

```bash
$ klp --with map "json => getTime(json)" < 2019.jsonl
$ klp --with map "getTime" < 2019.jsonl
```

### Changing `klp` Defaults

You may **globally** change default chunkers, deserializers, appliers, and serializers in `~/.klp/index.js`, as follows:

```js
module.exports = {
  plugins:  [],
  context:  {},
  defaults: {
    chunker:      'sample',
    deserializer: 'sample',
    appliers:     'sample',
    serializer:   'sample',
    noPlugins:    false
  }
}
```

> :see_no_evil: Defaults are assigned **globally** and changing them may **break existing `klp` scripts**!
> Use this feature responsibly.

## `id` Plugin

`klp` includes the [`id`][klp-id] plugin that comes with the following extensions:

|                   | Description                                                                |
|-------------------|----------------------------------------------------------------------------|
| `id` chunker      | Returns each data as a chunk.                                              |
| `id` deserializer | Returns all chunks unchanged.                                              |
| `id` applier      | Does not apply any functions and returns the JSON objects unchanged.       |
| `id` serializer   | Applies Object.prototype.toString to the input and joins without newlines. |

## Comparison to Related Tools

|                         | [`klp`][klp]/[`pxi`][pxi]                                                           | [`jq`][jq]                                                   | [`mlr`][mlr]                                                                                                                                                            | [`fx`][fx]                                                                            | [`gawk`][gawk]                                                                                                                                                   |
|-------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Self-description**    | *Small, fast, and magical command-line data processor similar to awk, jq, and mlr.* | *Command-line JSON processor*                                | *Miller is like awk, sed, cut, join, and sort for name-indexed data such as CSV, TSV, and tabular JSON*                                                                 | *Command-line tool and terminal JSON viewer*                                          | *The awk utility interprets a special-purpose programming language that makes it possible to handle simple data-reformatting jobs with just a few lines of code* |
| **Focus**               | Transforming data with user provided functions and converting between formats       | Transforming JSON with user provided functions               | Transforming CSV with user provided functions and converting between formats                                                                                            | Transforming JSON with user provided functions                                        | Language for simple data reformatting tasks                                                                                                                      |
| **License**             | [MIT][license]                                                                      | [MIT][jq-license]                                            | [BSD-3-Clause][mlr-license]                                                                                                                                             | [MIT][fx-license]                                                                     | [GPL-3.0-only][gawk-license]                                                                                                                                     |
| **Performance**         | (performance is given relative to `klp`/`pxi`)                                      | `jq` is [>3x slower](#performance) than `klp`                | `mlr` is [>3x slower](#performance) than `klp`                                                                                                                          | `fx` is [>15x slower](#performance) than `klp`                                        | [`klp` is as performant as `gawk`](#performance) when processing JSON and CSV                                                                                    |
| **Processing Language** | JavaScript and all [JavaScript libraries][npm]                                      | [jq language][jq-lang]                                       | [Predefined verbs and custom put/filter DSL][mlr-verbs]                                                                                                                 | JavaScript and all [JavaScript libraries][npm]                                        | [awk language][gawk-lang]                                                                                                                                        |
| **Extensibility**       | (Third-party) [Plugins](#plugins), any [JavaScript library][npm], custom functions  | (Third-party) [Modules][jq-modules] written in [jq][jq-lang] | Running arbitrary [shell commands][mlr-shell]                                                                                                                           | Any [JavaScript library][npm], custom functions                                       | [`gawk` dynamic extensions][gawk-extensions]                                                                                                                     |
| **Similarities**        |                                                                                     | `klp` and `jq` both heavily rely on JSON                     | `klp` and `mlr` both convert back and forth between CSV and JSON                                                                                                        | `klp` and `fx` both apply JavaScript functions to JSON streams                        | `klp` and `gawk` both transform data                                                                                                                             |
| **Differences**         |                                                                                     | `klp` and `jq` use different processing languages            | While `klp` uses a programming language for data processing, `mlr` uses a custom put/filter DSL, also, `mlr` reads in the whole file while `klp` processes it in chunks | `klp` supports data formats other than JSON, and `fx` provides a terminal JSON viewer | While `klp` functions transform a JSON into another JSON, `gawk` does not have a strict format other than transforming strings into other strings                |

## Reporting Issues

Please report issues [in the tracker][issues]!

## Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to pixie, you agree to abide by the [code of conduct][code].
Please read the [contributing guide][contribute].

## License

`klp` is [MIT licensed][license].

[actions]: https://github.com/Yord/klp/actions
[code]: https://github.com/Yord/klp/blob/master/CODE_OF_CONDUCT.md
[contribute]: https://github.com/Yord/klp/blob/master/CONTRIBUTING.md
[fx]: https://github.com/antonmedv/fx
[fx-license]: https://github.com/antonmedv/fx/blob/master/LICENSE
[gawk]: https://www.gnu.org/software/gawk/
[gawk-extensions]: https://www.gnu.org/software/gawk/manual/gawk.html#Dynamic-Extensions
[gawk-lang]: https://www.gnu.org/software/gawk/manual/gawk.html
[gawk-license]: https://www.gnu.org/software/gawk/manual/gawk.html#GNU-General-Public-License
[issues]: https://github.com/Yord/klp/issues
[jq]: https://github.com/stedolan/jq
[jq-lang]: https://github.com/stedolan/jq/wiki/jq-Language-Description
[jq-license]: https://github.com/stedolan/jq/blob/master/COPYING
[jq-modules]: https://stedolan.github.io/jq/manual/#Modules
[license]: https://github.com/Yord/klp/blob/master/LICENSE
[lodash]: https://lodash.com/
[mlr]: https://github.com/johnkerl/miller
[mlr-license]: https://github.com/johnkerl/miller/blob/master/LICENSE.txt
[mlr-shell]: http://johnkerl.org/miller/doc/data-sharing.html#Running_shell_commands
[mlr-verbs]: http://johnkerl.org/miller/doc/reference-verbs.html
[node]: https://nodejs.org/
[npm]: https://www.npmjs.com
[npm-install]: https://docs.npmjs.com/downloading-and-installing-packages-globally
[npm-package]: https://www.npmjs.com/package/klp
[klp]: https://github.com/Yord/klp
[klp-core]: https://github.com/Yord/klp-core
[klp-benchmarks]: https://github.com/Yord/klp-benchmarks
[klp-dsv]: https://github.com/Yord/klp-dsv
[klp-id]: https://github.com/Yord/klp/tree/master/src/plugins/id
[klp-json]: https://github.com/Yord/klp-json
[klp-module]: https://github.com/Yord/klp#klp-module
[klp-klp]: https://github.com/Yord/klp-klp
[klp-sample]: https://github.com/Yord/klp-sample
[klp-sandbox]: https://github.com/Yord/klp-sandbox
[ramda]: https://ramdajs.com/
[shield-license]: https://img.shields.io/npm/l/klp?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/klp?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/klp.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/klp/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/klp/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/klp/workflows/windows/badge.svg?branch=master
[teaser]: https://github.com/Yord/klp/blob/master/teaser.gif?raw=true
[unix-philosophy]: https://en.wikipedia.org/wiki/Unix_philosophy