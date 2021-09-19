---
title = "Разбираемся чем отличаются горячие и холодные потоки в RxJS"
date = 2020-08-29T00:00:00.000Z
author = "mephistorine"
draft = false
tags = [ "rxjs" ]
excerpt = "В этой статье я объясню вам в чем отличие холодного и горячего потоков"
---

Расскажу это так как понимаю я!

> Холодный поток просчитывается индивидуально для каждого подписчика,
> то есть вы получите все элементы потока с самого первого, в отличие от
> горячего потока, значения которого вы будете получать после того как
> подпишетесь, все предыдущие элементы вы пропустите.

Если вы посмотрите на код ниже, то увидите что первая подписка,
что вторая получают одинаковые результаты независимо от того
когда они подписались. Все потому, что `coldStream` это холодный поток.

```typescript
import { of } from "rxjs"

const coldStream = of(1, 2, 3, 4, 5)

const sub1 = coldStream.subscribe(v => console.log(v))
//> 1, 2, 3, 4, 5

setTimeout(() => {
  const sub2 = coldStream.subscribe(v => console.log(v))
  //> 1, 2, 3, 4, 5
}, 1000)
```

Теперь давайте глянем как выглядит код горячего потока

```typescript
import { Subject } from "rxjs"

const hotStream = new Subject()

const sub1 = hotStream.subscribe(v => console.log(v))
//> 1, 2, 3, 4, 5

hotStream.next(1)
hotStream.next(2)
hotStream.next(3)

const sub2 = hotStream.subscribe(v => console.log(v))
//> 4, 5

hotStream.next(4)
hotStream.next(5)
hotStream.complete()
```
