FROM trestletech/plumber
RUN apt-get -y update --allow-releaseinfo-change && apt-get install -y gcc-8-base && apt-get install -y libxml2-dev
RUN Rscript -e "install.packages('devtools')"
RUN Rscript -e "devtools::install_github('mongosoup/rmongodb')"
RUN Rscript -e "install.packages('r4ss')"
RUN Rscript -e "install.packages('RJSONIO')"
RUN Rscript -e "install.packages('plyr')"
RUN Rscript -e "install.packages('matrixStats')"
WORKDIR /app/
COPY rmongo.r /app/
CMD ["/app/rmongo.r"]
