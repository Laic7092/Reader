# 中文排版需求

暂时脑子很乱,本来以为找到了W3C规范就可以解决宽度计算问题没想到麻烦还是一堆,似乎是个简单的算法,但是我的实践能力很差.

## 标点符号的宽度调整

标注在字间的标点符号（除乙式括号、破折号、省略号以外）通常占一个汉字宽度，使其易于识别、适合配置及排版，有些排版风格完全不对标点宽度进行任何调整。但是为了让文字体裁更加紧凑易读，以及执行[3.1.4 行首行尾禁则 ](https://w3c.github.io/clreq/#prohibition_rules_for_line_start_end)时，就需要对标点符号的宽度进行调整。是否调整取决于对排版风格的判断，台湾的很多印刷品都采用不调整的风格；而在中国大陆和香港的出版物中，多数采取调整的风格。标点符号宽度调整通常分为两种情形：1. 标点符号连续出现 2.标点出现在行首或行尾。调整时的风格不尽相同，下文仅阐述基本原则。

### 标点符号的调整空间

标点符号分为“不可调整”和“可调整”两类，“可调整”再根据调整空间分为六类：横排字面左、横排字面右、横排左右两侧；直排字面上、直排字面下、直排上下两侧。

![标点符号的调整空间](https://s2.loli.net/2024/04/27/YeWzJ7FbHCl6kuq.png)

不可调整的标点包括：中国大陆GB式的半字连接号、间隔号、分隔号，因为这几个标点固定半个字宽；横排的港台式问号、感叹号和直排的冒号、分号、问号、感叹号（包括GB偏靠式和港台居中式），因为这几个标点固定一个字宽。

### 连续标点符号的调整

无论文本整体采用何种风格，当夹注符号与其他符号连续排列时，或者夹注符号重复出现（如开始+开始，结束+结束，或者结束+开始）时，都应该进行原则上的调整，以使文字体裁更加紧凑、易读。

原则上的调整度应为：如果任意两个相邻标点符号占用2个字宽，应当缩减成1.5个字宽。在此原则上，允许排版风格进一步调整让两个符号只占1个字宽。

挤压方向判定原则上应该让开始、结束夹注符号应紧靠被夹注的内容。

### 行首行尾标点挤压

当标点符号出现在行首或行尾时，以下的空隙调整规则使文字体裁更加紧凑、易读。

1. 在使用段首缩进格式的排版中，若首行行首出现开始夹注符号，可以缩减该符号始侧二分之一个汉字大小的空白。
2. 当行首出现开始夹注符号，可以缩减该符号始侧二分之一个汉字大小的空白。
3. 依照中国大陆国标GB/T 15834—2011《标点符号用法》第5.1.10条的规定，原本占一个字宽的标点出现在行尾时，应缩减该符号末侧二分之一个汉字大小的空白。

## 行首行尾禁则

为了保持阅读顺畅、体例一致，多数标点符号的位置有限制，通常一个标点符号依其性质，禁止出现在行首或行尾。

具体地，可以分为四种级别：

1. 不处理

完全不处理行首行尾禁则。常见于台湾香港等地报刊。

2. 基本处理

点号（顿号、逗号、句号、冒号、分号、叹号、问号）、结束引号、结束括号、结束双书名号（书名号乙式）、连接号、间隔号、分隔号不能出现在一行的开头。开始引号、开始括号、开始单双书名号等符号，不能出现在一行的结尾。这是最推荐的方法。

3. GB法

在执行[基本处理](https://w3c.github.io/clreq/#prohibition-rules-basic)的基础上增加规定分隔号也不能出现在一行的结尾。

4. 严格处理

在执行[GB法](https://w3c.github.io/clreq/#prohibition-rules-guobiao)的基础上再增加规定破折号、省略号不能出现在一行的开头。

在处理禁则之前，应优先按照排版风格处理[标点符号的宽度调整 ](https://w3c.github.io/clreq/#punctuation_width_adjustment)，因为标点挤压处理会影响换行位置。

> [!NOTE]
>
> 排版时如果进行禁则处理，应遵守“先挤进，后推出”原则，即不希望标点符号出现在行首时，应在已经标点挤压的基础上再次检讨是否有机会将其挤到前一行，最后没有挤压机会再从前一行取最后一个字至下一行。前行多出来的空间需按照优先顺序拉伸，最后没有拉伸机会再按平均拉大字距的方式处理。



## 符号分离禁则

1. **标点符号**

   以下标点符号占用两个汉字的空间，应视为一体，不能拆成两行。但若这些标点符号连续出现多个，允许按照[3.2.4 西文使用比例字体时的混排处理 ](https://w3c.github.io/clreq/#handling_western_text_in_chinese_text_using_proportional_western_fonts)的做法将其拆成两行。如果强制将其排列于一行，前行的字距可能会过大，从而影响整体排版的美观。

   1. **乙式括号与破折号**

      乙式括号与破折号是占两个汉字空间的U+2E3A TWO-EM DASH [⸺] 或连续使用两个U+2014 EM DASH [—]。

   2. **省略号**

      省略号使用连续两个U+2026 HORIZONTAL ELLIPSIS […]或U+22EF MIDLINE HORIZONTAL ELLIPSIS [⋯]，占两个汉字空间、包含六个居中省略点[……]。

      《标点符号用法》（GB/T 15834—2011）5.1.5节还规定，两个省略号／删节号连用时，占四个汉字位置并须单独占一行。

2. **数字及其相应的前后缀单位符号**

3. **注释符号**

> [!NOTE]
>
> line-break可以影响标点符号
>
> word-break可以影响数字及其前后缀
>
> ```css
> /* 设置 CSS 属性 line-break 可以用来处理如何断开（break lines）带有标点符号的中文、日文或韩文（CJK）文本的行。 */
> line-break: anywhere;
> /* 对于 non-CJK (CJK 指中文/日文/韩文) 文本，可在任意字符间断行。 */
> word-break: break-all;
> ```
>

![localhost_5173_(iPhone 14 Pro Max)](https://s2.loli.net/2024/04/27/tFl1HZICw5YcVA2.png)

| 名称（繁） | 名称（简） | 字符 | Unicode | Unicode名称                 | 注                                                           |
| ---------- | ---------- | ---- | ------- | --------------------------- | ------------------------------------------------------------ |
| 破折號     | 破折号     | ⸺    | 2E3A    | TWO-EM DASH                 | 占二个汉字大小，呈一直线、中间不断开。                       |
|            |            | ——   | 2014    | EM DASH                     |                                                              |
| 刪節號     | 省略号     | ……   | 2026    | HORIZONTAL ELLIPSIS         | 占二个汉字大小，呈一点线、中间不断开，应将省略点置于字面中央。 |
|            |            | ⋯⋯   | 22EF    | MIDLINE HORIZONTAL ELLIPSIS |                                                              |

## 个人猜测与实验

> [!WARNING]
>
> 标点符号的宽度调整:还存在疑问,最新版edge,似乎并不满足,FireFox似乎也并不满足...
>
> 标注在字间的标点符号（除乙式括号、破折号、省略号以外）通常占一个汉字宽度，但是如果只用了半个又会出现尴尬的情况,而且还要考虑符号分离禁则
>
> 还有,中文根据字体不同,不同的标点符号,甚至是文字的宽度都会有所不同,大部分的标点符号是一个汉字(但不一定是font-size,可能会略大于或者略小于?)
>
> 现在发现的有,引号的宽度,不同字体宽度不同.

换句话说,所有的标点符号和文字都需要经过测量,才可以知道具体数值,然而分页算法注定与这些息息相关,或许需要提前计算好字符和标点符号的宽度?在标点符号宽度调整不满足的前提下,执行其他禁则,后续补充孤行和孤字?

## 0420测试

当前条件:

1. 计算取值

   ```
   testWidth = metrics.width;
   ```

2. 样式

   ```css
   line-break: anywhere;
   ```

3. 额外处理

   ```javascript
   function count(s: string, c: string) {
       return (s.match(new RegExp(c, 'g')) || []).length;
   }        
   
   // 统计左右引号出现次数,去掉多于宽度(基于canvas渲染的效果,和实际渲染效果对比)
   if (testWidth > maxWidth) {
   	// debugger
   	testWidth -= count(testLine, "”") * 9
   	testWidth -= count(testLine, "“") * 9
   }
   ```

   

1026 48 72 false
3075 48 72 false
4221 48 72 false

1. **testLine**: "根子…”心头诅咒了一声，奥巴帕也是开口喊道：“两万三千！”"

2. **testWidth**: 432.3671875

   

1. **testLine**: "是s级别的五星斗者，当然，这里的年龄界限，是二十以下。”"
2. **testWidth**: 430.40625



1. **testLine**: "。”萧战的声音刚刚落下，苍老的笑声，便是从门外朗笑传来。"
2. **testWidth**: 439



canvas效果

> ![image-20240420152201055](https://s2.loli.net/2024/04/20/QNT8xIwDrhnsB5g.png)



实际效果

> ![image-20240420152739233](C:\Users\Laix\AppData\Roaming\Typora\typora-user-images\image-20240420152739233.png)



很明显的,行尾超出尺寸(大小不一,具体机制不明,会强行塞入?或者说优化)





## 0423 update

### 逗号,句号不能出现在开头.

> ```css
> line-break: unset;
> ```
>
> ![localhost_5173_](C:\Users\Laix\Downloads\localhost_5173_.png)
>
> 



> ```css
> line-break: anywhere;
> ```
>
> ![localhost_5173_ (1)](C:\Users\Laix\Downloads\localhost_5173_ (1).png)

目前,最简陋算法没有考虑这点,分行如下

```javascript
[
    "由于此次并不需要太好的药材，所以萧炎只是随意的在药材",
    "店中挑选了年份最低的紫叶兰草和洗骨花，至于木属性魔晶",
    "，也是在经过几番排查后，买了一颗最便宜的青木鼠魔晶。"
]
```

### 中文引号宽度问题

![localhost_5173_ (2)](C:\Users\Laix\Downloads\localhost_5173_ (2).png)

```java
[
    "“能吧，不过那样药力就弱了，我给你配置的筑基灵液，可",
    "是按照最合适的搭配尽心炼制的。”戒指中，传出药老的声",
    "音。"
]
```

首行存在一个引号,宽度计算需要减去部分(原因未知)
还有一件事,末尾的句号,未知宽度,估算出来的结果或许略大与maxWidth(同之前总结),会硬塞...

## 0613 update
不出我所料，这个断更了，但是今天莫名取得了一点进展,我派出了所有的规则影响

1. 没有首行缩进
2. 没有段落间距
3. 忽略中文标点禁则
4. 换行点在任意处
5. 还有从未考虑的孤行
6. 还有从未考虑的中英文混排

假如，我是说假如，在这种勉强能计算出正确的高度的情况下，接下来可以做什么？已经，之后必须重新考虑这些，分辨CJK和非CJK，还有缩进，间距，字体和字号这些可配置，再加上一定要保证性能。

还有一点要注意的，就是动态高度虚拟list的问题，我认为现在在假设能够正确计算高度的基础上，可以优先解决这个问题，至少要满足基本的阅读和目录跳转功能，随后完善上段中提及的复杂问题。