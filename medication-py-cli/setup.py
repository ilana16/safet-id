
from setuptools import setup, find_packages

setup(
    name="medication-cli",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "click>=8.0.0",
        "supabase>=1.0.3",
        "python-dotenv>=1.0.0",
    ],
    entry_points="""
        [console_scripts]
        medication-cli=medication_cli.cli:cli
    """,
)
