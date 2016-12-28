REDIS_HOST = 'redis'
REDIS_PORT = 6379
REDIS_DB = 0
REDIS_URL = 'redis://{host}:{port}/{db}'.format(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
REDIS_TIMEOUT = 60 * 60

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
           'format':'%(asctime)s %(process)d %(processName)s %(levelname)s %(name)s:%(lineno)d %(message)s' 
        },
        'simple': {
           'format':'%(asctime)s %(levelname)5s  %(message)s'
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'syslog': {
            'level': 'INFO',
            'class': 'logging.handlers.SysLogHandler',
            'formatter': 'verbose',
            'address': ('localhost', 514),
        }
    },
    'loggers': {
        'sktz': {
            'handlers': ['console', 'syslog'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}
