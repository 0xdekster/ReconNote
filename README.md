# ReconNote
Web Application Security Automation Framework

It takes user input as a domain name and maximize the attack surface area by listing the assets of the domain like -

- Subdomains from - findomain, subfinder & resolvable subdomains using shuffledns
- Screenshots
- Port Scan
- JS files
- Httpx Status codes of subdomains
- Dirsearch file/dir paths by fuzzing


# Installation 

1 - Install Docker & docker-compose according to you OS from here - https://docs.docker.com/get-docker/ \
2 - git clone https://github.com/0xdekster/ReconNote.git \
3 - Open docker-compose.yml & change the volumes directory path to the output folder 

example -

volumes:
      - /root/reconnote/output/:/var/www/html 
   
4 - Change the API_HOST parameter value to your server/host ip or domain name.\
5 - Run docker-compose build \
6 - Run docker-compose up -d\
7 - Reconnote framework will be up at - {your-server}:3000 

# Usage

1 - Just enter domain/target name in Add Target & choose scan type\
2 - Everything will be done by Reconnote and in few minutes you will get the Scan Results

# Demo Video

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/jGpgreUY4H8/0.jpg)](https://youtu.be/jGpgreUY4H8)


# Acknowledgements

ReconNote Security framework have been created by using the open source security tools made by amazing security community -


1- [Eduard Tolosa](https://github.com/Edu4rdSHL/findomain)\
2- [Tomnomnom](https://github.com/tomnomnom)\
3- [Michen riksen](https://github.com/michenriksen/aquatone)\
4- [Project Discovery](https://github.com/projectdiscovery)\
5- [Corben Leo](https://github.com/lc)
