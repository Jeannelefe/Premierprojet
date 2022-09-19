onst cols = 3;
const main = document.getElementById('main');
let parts = [];

let images = [
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2700&q=80"
];
let current = 0;
let playing = false;

for (let i in images) {
  new Image().src = images[i];
}

for (let col = 0; col < cols; col++) {
  let part = document.createElement('div');
  part.className = 'part';
  let el = document.createElement('div');
  el.className = "section";
  let img = document.createElement('img');
  img.src = images[current];
  el.appendChild(img);
  part.style.setProperty('--x', -100/cols*col+'vw');
  part.appendChild(el);
  main.appendChild(part);
  parts.push(part);
}

let animOptions = {
  duration: 2.3,
  ease: Power4.easeInOut
};

function go(dir) {
  if (!playing) {
    playing = true;
    if (current + dir < 0) current = images.length - 1;
    else if (current + dir >= images.length) current = 0;
    else current += dir;

    function up(part, next) {
      part.appendChild(next);
      gsap.to(part, {...animOptions, y: -window.innerHeight}).then(function () {
        part.children[0].remove();
        gsap.to(part, {duration: 0, y: 0});
      })
    }

    function down(part, next) {
      part.prepend(next);
      gsap.to(part, {duration: 0, y: -window.innerHeight});
      gsap.to(part, {...animOptions, y: 0}).then(function () {
        part.children[1].remove();
        playing = false;
      })
    }

    for (let p in parts) {
      let part = parts[p];
      let next = document.createElement('div');
      next.className = 'section';
      let img = document.createElement('img');
      img.src = images[current];
      next.appendChild(img);

      if ((p - Math.max(0, dir)) % 2) {
        down(part, next);
      } else {
        up(part, next);
      }
    }
  }
}

window.addEventListener('keydown', function(e) {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    go(1);
  }

  else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    go(-1);
  }
});

function lerp(start, end, amount) {
  return (1-amount)*start+amount*end
}

const cursor = document.createElement('div');
cursor.className = 'cursor';

const cursorF = document.createElement('div');
cursorF.className = 'cursor-f';
let cursorX = 0;
let cursorY = 0;
let pageX = 0;
let pageY = 0;
let size = 8;
let sizeF = 36;
let followSpeed = .16;

document.body.appendChild(cursor);
document.body.appendChild(cursorF);

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorF.style.display = 'none';
}

cursor.style.setProperty('--size', size+'px');
cursorF.style.setProperty('--size', sizeF+'px');

window.addEventListener('mousemove', function(e) {
  pageX = e.clientX;
  pageY = e.clientY;
  cursor.style.left = e.clientX-size/2+'px';
  cursor.style.top = e.clientY-size/2+'px';
});

function loop() {
  cursorX = lerp(cursorX, pageX, followSpeed);
  cursorY = lerp(cursorY, pageY, followSpeed);
  cursorF.style.top = cursorY - sizeF/2 + 'px';
  cursorF.style.left = cursorX - sizeF/2 + 'px';
  requestAnimationFrame(loop);
}

loop();

let startY;
let endY;
let clicked = false;

function mousedown(e) {
  gsap.to(cursor, {scale: 4.5});
  gsap.to(cursorF, {scale: .4});

  clicked = true;
  startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}
function mouseup(e) {
  gsap.to(cursor, {scale: 1});
  gsap.to(cursorF, {scale: 1});

  endY = e.clientY || endY;
  if (clicked && startY && Math.abs(startY - endY) >= 40) {
    go(!Math.min(0, startY - endY)?1:-1);
    clicked = false;
    startY = null;
    endY = null;
  }
}
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
window.addEventListener('touchmove', function(e) {
  if (clicked) {
    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }
}, false);
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

let scrollTimeout;
function wheel(e) {
  clearTimeout(scrollTimeout);
  setTimeout(function() {
    if (e.deltaY < -40) {
      go(-1);
    }
    else if (e.deltaY >= 40) {
      go(1);
    }
  })
}
window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);
var data = [
  {
    'key': 1,
    'title': 'An example article',
    'author': 'Chris Macrae',
    'time': 1455660206777
  },
  {
    'key': 2,
    'title': 'The truth about animated lists...',
    'author': 'Chris Macrae',
    'time': 1455660206777
  },
  {
    'key': 3,
    'title': 'Why I watched the Lion King 542 times as a child',
    'author': 'Chris Macrae',
    'time': 1455660206777
  },
  {
    'key': 4,
    'title': 'Daffy Duck laughing on repeat for 100 hrs',
    'author': 'Chris Macrae',
    'time': 1455660206777
  },
  {
    'key': 5,
    'title': '01101000 01100101 01101100 01101100 01101111',
    'author': 'Chris Macrae',
    'time': 1455660206777
  },
];

var ListContainer = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  render: function() {
    return (
      <div>
        <header>
          <h1>An animated react list</h1>
          <div className="buttons">
            <button className="data-toggle" onClick={this.mixItUp}>Mix it up!</button>
          </div>
        </header>
        <div className="list-container">
          <List items={this.state.data} ripItUp={this.ripItUp} resetIt={this.resetIt} />
        </div>
     </div>
    )
  },
  mixItUp: function() {
    var array = this.state.data;
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    this.setState({data: array});
  },
  ripItUp: function(key) {
    var array = this.state.data;
    if(!key) return;
    var ripItUpKey;
    array.forEach(function(item, index) {
      if(item.key === key) {
        ripItUpKey = index;
      }
    });

    if(ripItUpKey !== undefined) {
      array.splice(ripItUpKey, 1);
      this.setState({data: array});
    }
  },
  resetIt: function() {
    console.log(data);
    console.log(this.props.data);
    this.setState({data: data});
  }
})

var List = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.setState({items: this.props.items});
  },
  render: function() {
    if(this.props.items.length === 0) {
      return(
        <div className="empty-state">
          <h1>щ(ಥДಥщ)</h1>
          <p class="caption"><em>I'm so empty and alone</em></p>
        </div>
      )
    }
    return(
      <ul className="list">
       {this.props.items.map(this.handleItemRender)}
      </ul>
    )
  },
  handleItemRender: function(item, index) {
    var postDate = moment(item.post_date).fromNow();
    return(
      <ListElement title={item.title} author={item.author} postDate={postDate} id={item.key} ref={item.key} key={item.key} ripItUp={this.props.ripItUp} />
    );
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    
    if(this.props.items.length > 0) {
      var newState = this.props.items.reduce(function(state, child) {
        if(!child.key) return state;
        var currentState = component.state;
        var domNode = ReactDOM.findDOMNode(component.refs[child.key]);
        var boundingBox = domNode.getBoundingClientRect();

        currentState[child.key] = boundingBox;
        currentState.items = component.props.items;

        return currentState;
      });

      this.setState(newState);
    }
  },
  componentWillUpdate: function(nextProps, nextState) {
    var component = this;
    var newKeys = [];
    var areDestroyed = [];
    
    nextProps.items.forEach(function(newProp) {
      newKeys.push(newProp.key);
    });
    
    this.state.items.forEach(function(oldProp) {
      if(newKeys.indexOf(oldProp.key) == -1) {
      }  
    });
  },
  componentDidUpdate: function(previousProps) {
    if(!this.state) return;
    
    var component = this;
    var areDestroyed = [];
    var doNeedAnimation = [];
    
    previousProps.items.forEach(function(item) {
      if(component.doesNeedAnimation(item) === 0) {
        doNeedAnimation.push(item);
      }
    });
    
    doNeedAnimation.forEach(this.animateAndTransform.bind(this));
  },
  animateAndDestroy: function(child, n) {
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    
    requestAnimaytionFrame(function() {
      requestAnimationFrame(function() {
        domNode.style.opacity = "0";
        domNode.style.transform = "scale(2)"
      });
    });
  },
  animateAndTransform: function(child, n) {
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    
    var [dX, dY] = this.getPositionDelta(domNode, child.key);
    
    requestAnimationFrame(function(){
      domNode.style.transition = 'transform 0s';
      domNode.style.transform = 'translate('+ dX + 'px, ' + dY + 'px)';
      requestAnimationFrame(function() {
        domNode.style.transform  = '';
        domNode.style.transition = 'transform 400ms';
      })
    });
  },
  doesNeedAnimation: function(child) {
    var isNotMovable = !child.key;
    var isNew = !this.state[child.key];
    var isDestroyed = !this.refs[child.key];
    
    if(isDestroyed) return 2;
    if(isNotMovable || isNew) return;
    
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    var [dX, dY] = this.getPositionDelta(domNode, child.key);
    var isStationary = dX === 0 && dY === 0;

    return (isStationary === true) ? 1 : 0;
  },
  getPositionDelta: function(domNode, key) {
    var newBox = domNode.getBoundingClientRect();
    var oldBox = this.state[key];
    
    return [
      oldBox.left - newBox.left,
      oldBox.top - newBox.top
    ];
  },
  
})

var ListElement = React.createClass({
  render: function() {
    return (
      <li>
        <span className="list-badge">{this.props.id}</span>
        <span className="list-article-summary">
          <h2 className="list-title">{this.props.title}</h2>
          <span className="list-author">{this.props.author}</span>
        </span>
        <span className="list-post-date">Posted {this.props.postDate}</span>
        <span className="list-close" onClick={this.props.ripItUp.bind(null, this.props.id)}>✕</span>
      </li>
    );
  },
})

React.render( 
  <ListContainer data={data} />,
  document.querySelector('#react-mount')
);