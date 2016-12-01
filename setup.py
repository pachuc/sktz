setuptools import setup, find_packages

setup(
    name='sktz',
    version='0.0.1',
    author_email='bpgoku2002@gmail.com',
    description='Service to connect smartphones to desktop browsers',
    install_requires=[
        'Flask-Sockets==0.2.1',
        'gunicorn==19.6.0',
        'redis==2.10.5',
    ],
    packages=find_packages(),

)
