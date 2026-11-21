FROM python:3.12-alpine AS assets
RUN pip install --no-cache-dir Pillow
WORKDIR /build
COPY raw_assets ./raw_assets
COPY public ./public
COPY generate_pages.py ./generate_pages.py
COPY optimize_assets.py ./optimize_assets.py
RUN python generate_pages.py && python optimize_assets.py

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=assets /build/public /usr/share/nginx/html
EXPOSE 80
