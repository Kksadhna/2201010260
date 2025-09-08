import React, { useState, useEffect } from 'react';

// Mandatory logging integration placeholder
const logger = {
  log: (message, type) => {
    // In a real application, this would send logs to a backend service.
    // For this demonstration, we'll just log to the console.
    console.log(`[${type}] ${message}`);
  }
};

// Data persistence placeholder. Use localStorage for demonstration.
// In a real app, this would be a backend database.
const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      logger.log(`Error parsing data from localStorage for key: ${key}`, 'ERROR');
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      logger.log(`Error saving data to localStorage for key: ${key}`, 'ERROR');
    }
  }
};

const styles = `
.app-container {
  background-color: #f3f4f6;
  min-height: 100vh;
  font-family: sans-serif;
  padding: 0;
  margin: 0;
}

.navbar {
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-bottom: 4px solid #1d4ed8;
  flex-wrap: wrap;
}

.main-content {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding: 2.5rem;
  background-color: #f9fafb;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.button {
  background-color: #1d4ed8;
  color: #ffffff;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  transform: scale(1);
}

.button:hover {
  background-color: #1e40af;
  transform: scale(1.05);
}

.button:disabled {
  background-color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

.text-field-container {
  margin-bottom: 1.5rem;
}

.text-field-label {
  display: block;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.text-field-input {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  appearance: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #4b5563;
  line-height: 1.5;
  outline: none;
  transition: all 0.2s ease;
}

.text-field-input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px #3b82f6;
}

.text-field-error {
  border-color: #ef4444;
}

.text-field-helper-text {
  color: #ef4444;
  font-style: italic;
  margin-top: 0.25rem;
  font-size: 0.75rem;
}

.card {
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.01);
}

.typography-h4 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 2rem;
  border-bottom: 2px solid #93c5fd;
  padding-bottom: 0.5rem;
  text-align: center;
}

.typography-h5 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
}

.typography-body1 {
  color: #4b5563;
  line-height: 1.625;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.results-section {
  margin-top: 3rem;
}

.results-heading {
  text-align: center;
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.result-bold {
  font-weight: 700;
}

.result-normal {
  font-weight: 400;
  color: #6b7280;
}

.result-link {
  color: #3b82f6;
  text-decoration: none;
}

.result-link:hover {
  text-decoration: underline;
}

.click-data-section {
  margin-top: 1rem;
}

.click-list {
  list-style: disc;
  padding-left: 1rem;
  color: #6b7280;
}

.text-center {
  text-align: center;
}

.break-words {
  word-break: break-all;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
    margin: 1rem;
    width: 95%;
  }

  .typography-h4 {
    font-size: 1.75rem;
  }

  .typography-h5 {
    font-size: 1.25rem;
  }

  .button {
    padding: 0.5rem 1rem;
  }

  .navbar {
    padding: 0.5rem;
  }
}
`;

const StyleWrapper = ({ children }) => (
  <>
    <style>{styles}</style>
    {children}
  </>
);

const MuiButton = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`button ${className}`}
  >
    {children}
  </button>
);

const MuiTextField = ({ label, value, onChange, type, error, helperText, placeholder }) => (
  <div className="text-field-container">
    <label className="text-field-label">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`text-field-input ${error ? 'text-field-error' : ''}`}
    />
    {error && <p className="text-field-helper-text">{helperText}</p>}
  </div>
);

const MuiCard = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

const MuiPaper = ({ children, className }) => (
  <div className={`paper ${className}`}>
    {children}
  </div>
);

const MuiTypography = ({ children, variant, className }) => {
  switch (variant) {
    case 'h4':
      return <h4 className={`typography-h4 ${className}`}>{children}</h4>;
    case 'h5':
      return <h5 className={`typography-h5 ${className}`}>{children}</h5>;
    case 'body1':
    default:
      return <p className={`typography-body1 ${className}`}>{children}</p>;
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('shortener');
  const [urls, setUrls] = useState(Array(5).fill({ originalUrl: '', validity: '', shortcode: '' }));
  const [errors, setErrors] = useState(Array(5).fill({ originalUrl: '', validity: '' }));
  const [results, setResults] = useState([]);
  const [shortenedUrlsData, setShortenedUrlsData] = useState([]);
  const [shortcodeClicks, setShortcodeClicks] = useState({});

  useEffect(() => {
    const storedUrls = storage.get('shortenedUrls') || [];
    setShortenedUrlsData(storedUrls);
    const storedClicks = storage.get('shortcodeClicks') || {};
    setShortcodeClicks(storedClicks);
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (index, field) => (e) => {
    const newUrls = [...urls];
    newUrls[index][field] = e.target.value;
    setUrls(newUrls);

    const newErrors = [...errors];
    newErrors[index][field] = '';
    setErrors(newErrors);
  };

  const handleShorten = () => {
    logger.log('Shorten button clicked', 'INFO');
    const newErrors = Array(5).fill({ originalUrl: '', validity: '' });
    let hasError = false;

    urls.forEach((url, index) => {
      if (url.originalUrl && !isValidUrl(url.originalUrl)) {
        newErrors[index].originalUrl = 'Invalid URL format';
        hasError = true;
      }
      if (url.validity && (!Number.isInteger(Number(url.validity)) || Number(url.validity) <= 0)) {
        newErrors[index].validity = 'Validity must be a positive integer';
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      logger.log('Client-side validation failed', 'ERROR');
      return;
    }

    const newResults = [];
    const newShortenedUrls = [...shortenedUrlsData];

    urls.forEach(url => {
      if (url.originalUrl) {
        const shortcode = url.shortcode || Math.random().toString(36).substring(2, 8);
        const validity = url.validity ? parseInt(url.validity, 10) : 30;
        const expiryDate = new Date(new Date().getTime() + validity * 60000).toLocaleString();
        const shortenedLink = `http://localhost:3000/${shortcode}`;

        newResults.push({
          originalUrl: url.originalUrl,
          shortenedLink,
          expiryDate
        });

        const newUrlData = {
          originalUrl: url.originalUrl,
          shortenedLink,
          shortcode,
          creationDate: new Date().toLocaleString(),
          expiryDate,
          clicks: [],
        };
        newShortenedUrls.push(newUrlData);
        setShortcodeClicks(prev => ({ ...prev, [shortcode]: { count: 0, detailed: [] } }));
        logger.log(`Shortened URL created for ${url.originalUrl}`, 'SUCCESS');
      }
    });

    setResults(newResults);
    setShortenedUrlsData(newShortenedUrls);
    storage.set('shortenedUrls', newShortenedUrls);
    storage.set('shortcodeClicks', shortcodeClicks);
  };

  const logClick = (shortcode) => {
    logger.log(`Shortlink ${shortcode} clicked`, 'INFO');
    const location = 'Unknown';
    const timestamp = new Date().toLocaleString();

    setShortenedUrlsData(prevData => {
      const newData = prevData.map(url => {
        if (url.shortcode === shortcode) {
          return {
            ...url,
            clicks: [...url.clicks, { timestamp, source: 'UI Click', location }]
          };
        }
        return url;
      });
      storage.set('shortenedUrls', newData);
      return newData;
    });

    setShortcodeClicks(prev => {
      const newClicks = { ...prev };
      newClicks[shortcode] = {
        count: (newClicks[shortcode]?.count || 0) + 1,
        detailed: [...(newClicks[shortcode]?.detailed || []), { timestamp, source: 'UI Click', location }]
      };
      storage.set('shortcodeClicks', newClicks);
      return newClicks;
    });
  };

  const renderUrlShortenerPage = () => (
    <MuiPaper className="main-content">
      <MuiTypography variant="h4">URL Shortener Page</MuiTypography>
      {urls.map((url, index) => (
        <MuiCard key={index}>
          <MuiTypography variant="h5">URL #{index + 1}</MuiTypography>
          <MuiTextField
            label="Original URL"
            type="text"
            value={url.originalUrl}
            onChange={handleInputChange(index, 'originalUrl')}
            error={!!errors[index].originalUrl}
            helperText={errors[index].originalUrl}
            placeholder="e.g., https://www.example.com"
          />
          <MuiTextField
            label="Validity (minutes)"
            type="text"
            value={url.validity}
            onChange={handleInputChange(index, 'validity')}
            error={!!errors[index].validity}
            helperText={errors[index].validity}
            placeholder="e.g., 30"
          />
          <MuiTextField
            label="Custom Shortcode (optional)"
            type="text"
            value={url.shortcode}
            onChange={handleInputChange(index, 'shortcode')}
            placeholder="e.g., my-link"
          />
        </MuiCard>
      ))}
      <div className="button-container">
        <MuiButton onClick={handleShorten}>Shorten URLs</MuiButton>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <MuiTypography variant="h5" className="results-heading">Shortened URLs</MuiTypography>
          {results.map((result, index) => (
            <MuiCard key={index}>
              <div className="result-item">
                <div>
                  <MuiTypography variant="body1" className="result-bold">
                    Original: <span className="result-normal">{result.originalUrl}</span>
                  </MuiTypography>
                  <MuiTypography variant="body1" className="result-bold">
                    Shortened: <a href={result.shortenedLink} target="_blank" rel="noopener noreferrer" className="result-link">{result.shortenedLink}</a>
                  </MuiTypography>
                  <MuiTypography variant="body1" className="result-bold">
                    Expires: <span className="result-normal">{result.expiryDate}</span>
                  </MuiTypography>
                </div>
              </div>
            </MuiCard>
          ))}
        </div>
      )}
    </MuiPaper>
  );

  const renderStatisticsPage = () => (
    <MuiPaper className="main-content">
      <MuiTypography variant="h4">URL Shortener Statistics</MuiTypography>
      {shortenedUrlsData.length > 0 ? (
        shortenedUrlsData.map((url, index) => (
          <MuiCard key={index}>
            <MuiTypography variant="h5" className="break-words">
              {url.shortenedLink}
            </MuiTypography>
            <MuiTypography variant="body1" className="result-bold">
              Original URL: <span className="result-normal">{url.originalUrl}</span>
            </MuiTypography>
            <MuiTypography variant="body1" className="result-bold">
              Created: <span className="result-normal">{url.creationDate}</span>
            </MuiTypography>
            <MuiTypography variant="body1" className="result-bold">
              Expires: <span className="result-normal">{url.expiryDate}</span>
            </MuiTypography>
            <MuiTypography variant="body1" className="result-bold">
              Total Clicks: <span className="result-normal">{shortcodeClicks[url.shortcode]?.count || 0}</span>
            </MuiTypography>
            {shortcodeClicks[url.shortcode]?.detailed.length > 0 && (
              <div className="click-data-section">
                <MuiTypography variant="body1" className="result-bold">Click Data:</MuiTypography>
                <ul className="click-list">
                  {shortcodeClicks[url.shortcode]?.detailed.map((click, i) => (
                    <li key={i}>
                      Timestamp: {click.timestamp}, Source: {click.source}, Location: {click.location}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="button-container">
                <MuiButton onClick={() => logClick(url.shortcode)}>Simulate Click</MuiButton>
            </div>
          </MuiCard>
        ))
      ) : (
        <MuiTypography variant="body1" className="text-center">
          No shortened URLs to display.
        </MuiTypography>
      )}
    </MuiPaper>
  );

  return (
    <StyleWrapper>
      <div className="app-container">
        <nav className="navbar">
          <MuiButton onClick={() => setCurrentPage('shortener')}>Shorten URLs</MuiButton>
          <MuiButton onClick={() => setCurrentPage('stats')}>View Statistics</MuiButton>
        </nav>
        {currentPage === 'shortener' && renderUrlShortenerPage()}
        {currentPage === 'stats' && renderStatisticsPage()}
      </div>
    </StyleWrapper>
  );
}

export default App;
