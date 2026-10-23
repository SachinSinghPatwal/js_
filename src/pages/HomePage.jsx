import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/SachinSinghPatwal/js_";

function HomePage() {
  return (
    <main className="visualizer-home">
      <header className="home-nav">
        <Link
          className="home-wordmark"
          to="/"
          aria-label="JavaScript Visualizer home"
        >
          JS Visualizer
        </Link>
        <nav className="home-nav-links" aria-label="Primary navigation">
          <Link to="/visualizer">Live editor</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <h1 id="home-title">
          Understand JavaScript
          <span> while you practice it.</span>
        </h1>
        <p className="home-intro">
          Write the code you would write in an interview, then follow each
          execution step through the call stack, heap, event loop, and queues.
        </p>
        <div className="home-actions">
          <Link className="home-primary-action" to="/visualizer">
            Open live editor <span aria-hidden="true">→</span>
          </Link>
          <a
            className="home-secondary-action"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            Read the source
          </a>
        </div>
      </section>

      <section
        className="runtime-preview"
        aria-label="JavaScript runtime visualizer preview"
      >
        <div className="preview-editor">
          <div className="preview-titlebar">practice.js</div>
          <pre aria-hidden="true">
            <code>
              <span className="code-line-number">1</span>
              <span>
                <i>const</i> answer = <b>(value)</b> =&gt; &#123;
              </span>
              {"\n"}
              <span className="code-line-number">2</span>
              <span>
                {" "}
                <i>return</i> value * <em>2</em>;
              </span>
              {"\n"}
              <span className="code-line-number">3</span>
              <span>&#125;;</span>
              {"\n"}
              <span className="code-line-number">4</span>
              <span></span>
              {"\n"}
              <span className="code-line-number">5</span>
              <span>
                console.<b>log</b>(answer(<em>21</em>));
              </span>
            </code>
          </pre>
        </div>
        <div className="preview-runtime">
          <div className="preview-titlebar">runtime</div>
          <div className="runtime-grid">
            <section>
              <h2>Call stack</h2>
              <p>answer(21)</p>
              <p>Global</p>
            </section>
            <section>
              <h2>Heap</h2>
              <p>answer → Function</p>
              <p>21 → Number</p>
            </section>
            <section>
              <h2>Event loop</h2>
              <p>Microtasks empty</p>
              <p>Macrotasks empty</p>
            </section>
          </div>
        </div>
      </section>

      <section
        className="home-capabilities"
        aria-label="What the visualizer shows"
      >
        <article>
          <p>01</p>
          <h2>Trace execution</h2>
          <span>See every statement run in order.</span>
        </article>
        <article>
          <p>02</p>
          <h2>Inspect state</h2>
          <span>Make scope, memory, and closures visible.</span>
        </article>
        <article>
          <p>03</p>
          <h2>Practice clearly</h2>
          <span>Build a better explanation for your next interview.</span>
        </article>
      </section>
    </main>
  );
}

export default HomePage;
