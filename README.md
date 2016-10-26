##Household Activation Pilot

[View the live demo](http://zacharybedrosian.com/LEARNING/V16/index.html)

Household Activation Pilot is a single page dashboard that summarizes a Learning Ally member's yearly reading statistics and reading averages.

---

ReactJS Tags
------------
Listed below are all of the tags in the index.html and what data point they correspond with.

**Importante Note: All of the reading stats are controlled by the CountUp.JS Script. I placed all of the custom init scripts in the html page for your reference.** 

You will have to change the 362 here. The one inside of the html element is overridden by countup, but I would input it there as well incase countup fails.

~~~  javascript
    // CountUp.JS Configuration
    var days = new CountUp("days-read", 0, 362, 0, 12.5, options); 
    var hours = new CountUp("hours-read", 0, 1925, 0, 12.5, options);
    var mins = new CountUp("avg-min-read", 0, 325, 0, 12.5, options);
    var weekends = new CountUp("weekends-read", 0, 118, 0, 12.5, options);
...
~~~

~~~ html
<!-- Learning Ally Member Frist Name -->
<span id=“first-name”>Carlos</span>

<!-- Learning Ally Total Days Read -->
<span id=“days-read”>362</span>

<!-- Learning Ally Member Total Hours Read -->
<span id=“hours-read”>1925</span>

<!-- Learning Aly Member Average Minutes Read -->
<span id=avg-min-read”>325</span>

<!-- Learning Ally Member Total Weekend Day Read -->
<span id="weekends-read">120</span>

...
~~~

Third Party Packages/Libraries
---
[Scroll Progress](https://github.com/jeremenichelli/scrollProgress)

[Page Loader Code Droplet](http://tympanus.net/codrops/2014/08/05/page-preloading-effect/)

[Typed.JS](https://github.com/mattboldt/typed.js/)

[Confetti Animation](http://codepen.io/iprodev/full/azpWBr/)

[Bootstrap 3](http://getbootstrap.com/)

[jQuery](https://jquery.com/)

End
---

Thanks! If you have any questions please reach me at zacharybedrosian@gmail.com

