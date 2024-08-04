#include<stdio.h>
#include<string.h>
void computeLPSArray(char* pat, int M, int* lps)
{
	int len = 0;
	lps[0] = 0; 
	int i = 1;
	while (i < M) 
	{
		if (pat[i] == pat[len]) 
		{
			len++;
			lps[i] = len;
			i++;
		}
		else 
		{
			if (len != 0) {
				len = lps[len - 1];
			}
			else 
			{
				lps[i] = 0;
				i++;
			}
		}
	}
}
int kmp(char* pat, char* txt)
{
	int M = strlen(pat);
	int N = strlen(txt);
	int lps[M];
	computeLPSArray(pat, M, lps);
	int flag=1,i=0,j=0; 
	while (i < N) 
	{
		if (pat[j] == txt[i]) 
		{
			j++;
			i++;
		}
		if (j == M) 
		{
			flag=0;
			break;
		}
		else if (i < N && pat[j] != txt[i]) 
		{
			if (j != 0)
				j = lps[j - 1];
			else
				i = i + 1;
		}
	}
	return flag;
}
void main(int argc, char const *argv[])
{
	char line[500],lang;
	char * ptr;
    int    ch = '.';
    ptr = strchr(argv[1], ch);
    lang=ptr[1];
	FILE* f=fopen(argv[1],"r");
	switch(lang)
	{
		case 'p': {
					char* imports[72]={"import os","import subprocess","import sys","import requests","import asyncio","import asynchat","import cmd","import codeop","import compileall","import crypt","import curses","import dbm","import dis","import distutils","import doctest","import dummy_threading","import ensurepip","import email","import fcntl","import ftplib","import http","import imaplib","import ipaddress","import multiprocessing","import nntplib","import pipes","import platform","import poplib","import posix","import profile","import pty","import pwd","import py_compile","import pyclbr","import resource","import runpy","import sched","import select","import selectors","import shutil","import site","import signal","import smtpd","import smtplib","import socket","import socketserver","import spwd","import sqlite3","import ssl","import sysconfig","import syslog","import tarfile","import telnetlib","import tempfile","import termios","import threading","import tkinter","import trace","import traceback","import tracemalloc","import tty","import turtle","import turtledemo","import unicodedata","import venv","import webbrowser","import winreg","import wsgiref","import zipapp","import zipfile","import zipimport","import zlib"};
				  	int i,flag,count=0;
				  	while (fgets(line, sizeof(line), f))
					{
						flag=1;
						count+=1;
						line[strcspn(line, "\n")] = 0;
						for(i=0;i<72;i++)
						{
							flag=strcmp(line,imports[i]);
							if(flag==0)
							{
								printf("User Code cannot be run due to the invalid module '%s' which is imported at line number: %d",imports[i],count);
								break;
							}
						}
						if(flag==0)
					  		break;
					}
					break;
				  }
		case 'c': {
					char* imports[]={"<unistd.h>","<threads.h>","<pthread.h>","<barrier>","<condition_variable>","<future>","<latch>","<mutex>","<semaphore>","<shared_mutex>","<stop_token>","<thread>","<sys/socket.h>","<fstream.h>","<fstream>","<filesystem>","<netinet/in.h>","<csignal>","<arpa/inet.h>","<netdb.h>","<semaphore.h>","<sys/syscall.h>","<errno.h>","<sys/types.h>","<sys/stat.h>","<sys/file.h>","<sys/random.h>","<sys/sendfile.h>","<sys/fcntl.h>","system","getenv","getenv_s","signal","raise","sig_atomic_t","SIG_DFL","SIG_IGN","SIGABRT","SIGFPE","SIGILL","SIGINT","SIGSEGV","SIGTERM","FILE","fpos","fpos_t","remove","rename","tmpfile","tmpfile_s","tmpnam","tmpnam_s","clearerr","feof","ferror","perror","ftell","fgetpos","fseek","fsetpos","rewind","fopen","fopen_s","freopen","freopen_s","fclose","fflush","setbuf","setvbuf","fwide"}; 
					int i,flag,count=0;
					while(fgets(line,sizeof(line),f))
					{
						flag=1;
						count+=1;
						line[strcspn(line,"\n")]=0;
						for(i=0;i<69;i++)
						{
							flag=kmp(imports[i],line);
							if(flag==0)
							{
								printf("User Code cannot be run due to the invalid header file/function '%s' which is included at line number: %d",imports[i],count);
								break;
							}
						}
						if(flag==0)
					  		break;
					}
					break;
				  }
	
	}
	fclose(f);
}