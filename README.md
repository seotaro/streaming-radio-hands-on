# ラジオストリーミングの保存 （node.js 版）

## らじる★らじる（NHK on Demand）

### ダウンロード

```bash
node rec-nhk-on-demand.js {r1|r2|r3} duration filename
```

- r1: NHKラジオ第1
- r2: NHKラジオ第2
- r3: NHKFM

## radiko

### ダウンロード

リアルタイム

```bash
node rec-radiko.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} duration filename
```

タイムフリー

```bash
node rec-radiko-time-free.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} start end filename
```

放送局IDは <http://radiko.jp/v3/station/region/full.xml> を参照のこと。

### 非公式API 放送局リスト

`https://radiko.jp/v3/station/list/{area_id}.xml`

area_id 例）

- `JP12`: 千葉県 [https://radiko.jp/v3/station/list/JP12.xml](https://radiko.jp/v3/station/list/JP12.xml)
- `JP13`: 東京都 [https://radiko.jp/v3/station/list/JP13.xml](https://radiko.jp/v3/station/list/JP13.xml)
- `JP27`: 大阪府 [https://radiko.jp/v3/station/list/JP27.xml](https://radiko.jp/v3/station/list/JP27.xml)
- `full`: 全国 [https://radiko.jp/v3/station/list/full.xml](https://radiko.jp/v3/station/list/full.xml)

### 非公式API 番組表

`https://radiko.jp/v3/program/${day}/${area_id}.xml`

day 例）

- `today`: [http://radiko.jp/v3/program/today/JP13.xml](http://radiko.jp/v3/program/today/JP13.xml)
- `tomorrow`: [http://radiko.jp/v3/program/tomorrow/JP13.xml](http://radiko.jp/v3/program/tomorrow/JP13.xml)
- `date/20260211`: [https://radiko.jp/v3/program/date/20260211/JP13.xml](https://radiko.jp/v3/program/date/20260211/JP13.xml)
