# PersonAccount Makefile

.PHONY: help install dev build test clean publish

help:
	@echo "PersonAccount 构建命令"
	@echo ""
	@echo "  make install    - 安装依赖"
	@echo "  make dev        - 安装开发依赖"
	@echo "  make build      - 构建 Python 包"
	@echo "  make test       - 运行测试"
	@echo "  make clean      - 清理构建产物"
	@echo "  make publish    - 发布到 PyPI"
	@echo "  make tag        - 创建 Git 标签"

install:
	cd python && pip install -r requirements.txt

dev:
	cd python && pip install -e ".[dev]"

build: clean
	cd python && python -m build

test:
	cd python && pytest tests/ -v

clean:
	rm -rf python/build python/dist python/*.egg-info
	rm -rf python/src/__pycache__ python/src/core/__pycache__
	rm -rf python/tests/__pycache__ python/.pytest_cache

publish: build
	cd python && twine upload dist/*

tag:
	git tag v$(VERSION)
	git push origin v$(VERSION)

init:
	cd python && python src/main.py
