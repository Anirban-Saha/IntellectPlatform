from pickle import TRUE
import subprocess
import sys
import os
import codecs
from pymongo import MongoClient

def update(output, score):
    _id = sys.argv[3]
    client = MongoClient("mongodb+srv://shresth01:shresth01@intellect.phvj7.mongodb.net/Project?retryWrites=true&w=majority")
    db = client.get_database("Project")
    sub = db.Submissions
    scoreList = db.Scores
    string = ""
    for each in output:
        string += each+"\n"
    x = scoreList.find_one({ "_id": _id })
    curScore = x["score"]
    if curScore < score:
        curScore = score
    scoreUpdate = { "score": curScore }
    subUpdate = { "status": "done" ,"output": string, "success": "true" }
    scoreList.update_one({ "_id": _id}, { '$set': scoreUpdate })
    sub.update_one({ "_id": _id }, { '$set': subUpdate })

def check(output):
    outputList = []
    outputDir = "outputs/" + sys.argv[4] + ".txt"
    with open(outputDir, "r") as f:
        outputList = f.readlines()
    totalLines = len(outputList)
    i = 0
    while i < totalLines:
        if output[i] == outputList[i]:
            i = i + 1   
            continue
        else:
            break
    score = (i/totalLines)*100
    return score

def fetchInput(flag):
    filepath = sys.argv[1]
    cwd = os.path.dirname(filepath)
    lines = []
    if flag == True:
        inputDir = "inputs/" + sys.argv[4] + ".txt"
        with open(inputDir,"r") as f:
            lines = f.readlines()
    os.chdir(cwd)
    if flag == False:
        with open("userInput.txt","r") as f:
            lines = f.readlines()
        fu = open("userInput.txt", "w")
        fu.close()
    f = open("output.txt", "w")
    f.close()
    return lines


def checking_function(filepath):
    st=""
    data=""
    with open(filepath,"r") as f:
        data = f.read().replace('\n', '')

    lang=filepath[filepath.find('.')+1]
    
    if(lang=='p'):
        illegal_imports=["os","subprocess","sys","requests","asyncio","asynchat","cmd","codeop","compileall","crypt","curses","dbm","dis","distutils","doctest","dummy_threading","ensurepip","email","fcntl","ftplib","http","imaplib","ipaddress","multiprocessing","nntplib","pipes","platform","poplib","posix","profile","pty","pwd","py_compile","pyclbr","resource","runpy","sched","select","selectors","shutil","site","signal","smtpd","smtplib","socket","socketserver","spwd","sqlite3","ssl","sysconfig","syslog","tarfile","telnetlib","tempfile","termios","threading","tkinter","trace","traceback","tracemalloc","tty","turtle","turtledemo","unicodedata","venv","webbrowser","winreg","wsgiref","zipapp","zipfile","zipimport","zlib"]
    elif(lang=='c'):
        illegal_imports=["unistd","threads","pthread","barrier","condition_variable","future","latch","mutex","semaphore","shared_mutex","stop_token","thread","sys/socket.h","fstream.h","fstream","filesystem","netinet/in.h","csignal","arpa/inet.h","netdb.h","semaphore.h","sys/syscall.h","<errno.h>","<sys/types.h>","<sys/stat.h>","<sys/file.h>","<sys/random.h>","<sys/sendfile.h>","<sys/fcntl.h>","fcntl.h","system","getenv","getenv_s","signal","raise","sig_atomic_t","SIG_DFL","SIG_IGN","SIGABRT","SIGFPE","SIGILL","SIGINT","SIGSEGV","SIGTERM","FILE","fpos","fpos_t","remove","rename","tmpfile","tmpfile_s","tmpnam","tmpnam_s","clearerr","feof","ferror","perror","ftell","fgetpos","fseek","fsetpos","rewind","fopen","fopen_s","freopen","freopen_s","fclose","fflush","setbuf","setvbuf","fwide","iomanip","ios","iosfwd","streambuf","sstream","strstream","istream","ostream"] 
    elif(lang=='j'):
        illegal_imports=["ping","Runtime","Runtime.getRuntime()","exec","Process","process","Runtime.getRuntime().exec","java.applet","java.awt","java.awt.color","java.awt.datatransfer","java.awt.desktop","java.awt.dnd","java.awt.event","java.awt.font","java.awt.im.spi","java.awt.image","java.awt.image.renderable","java.awt.print","java.beans","java.beans.beancontext","java.lang","java.lang.annotation","java.lang.constant","java.lang.instrument","java.lang.invoke","java.lang.management","java.lang.module","java.lang.ref","java.lang.reflect","java.net","java.net.http","java.net.spi","java.nio","java.nio.channels","java.nio.channels.spi","java.nio.file","java.nio.file.attribute","java.nio.file.spi","java.rmi","java.rmi.activation","java.rmi.dgc","java.rmi.registry","java.rmi.server","java.security","java.security.acl","java.security.cert","java.security.interfaces","java.security.spec","java.sql","java.time.temporal","java.time.zone","java.util.concurrent","java.util.concurrent.atomic","java.util.concurrent.locks","java.util.jar","java.util.logging","java.util.prefs","java.util.zip","javax.accessibility","javax.annotation.processing","javax.crypto","javax.crypto.interfaces","javax.crypto.spec","javax.imageio","javax.imageio.event","javax.imageio.metadata","javax.imageio.plugins.bmp","javax.imageio.plugins.jpeg","javax.imageio.plugins.tiff","javax.imageio.spi","javax.imageio.stream","javax.lang.model","javax.lang.model.element","javax.lang.model.type","javax.lang.model.util","javax.management","javax.management.loading","javax.management.modelmbean","javax.management.monitor","javax.management.openmbean","javax.management.relation","javax.management.remote","javax.management.remote.rmi","javax.management.timer","javax.naming","javax.naming.directory","javax.naming.event","javax.naming.ldap","javax.naming.ldap.spi", "javax.naming.spi","javax.net","javax.net.ssl","javax.print","javax.print.attribute","javax.print.attribute.standard","javax.print.event","javax.rmi.ssl","javax.script","javax.security.auth","javax.security.auth.callback","javax.security.auth.kerberos","javax.security.auth.login","javax.security.auth.spi","javax.security.auth.x500","javax.security.cert","javax.security.sasl","javax.smartcardio","Java™ Smart Card I/O API.""javax.sound.midi","javax.sound.midi.spi","javax.sound.sampled","javax.sound.sampled.spi","javax.sql","javax.sql.rowset","javax.sql.rowset.serial","javax.sql.rowset.spi","javax.swing","javax.swing.border","javax.swing.colorchooser","javax.swing.event","javax.swing.filechooser","javax.swing.plaf","javax.swing.plaf.basic","javax.swing.plaf.metal","javax.swing.plaf.multi","javax.swing.plaf.nimbus","javax.swing.plaf.synth","javax.swing.table","javax.swing.text","javax.swing.text.html","javax.swing.text.html.parser","javax.swing.text.rtf","javax.swing.tree","javax.swing.undo","javax.tools","javax.transaction.xa","javax.xml","javax.xml.catalog","javax.xml.crypto","javax.xml.crypto.dom","javax.xml.crypto.dsig","javax.xml.crypto.dsig.dom","javax.xml.crypto.dsig.keyinfo","javax.xml.crypto.dsig.spec","javax.xml.datatype","javax.xml.namespace","javax.xml.parsers","javax.xml.stream","javax.xml.stream.events","javax.xml.stream.util","javax.xml.transform","javax.xml.transform.dom","javax.xml.transform.sax","javax.xml.transform.stax","javax.xml.transform.stream","javax.xml.validation","javax.xml.xpath","jdk.dynalink","jdk.dynalink.beans","jdk.dynalink.linker","jdk.dynalink.linker.support","jdk.dynalink.support","jdk.javadoc.doclet","jdk.jfr","jdk.jfr.consumer","jdk.jshell","jdk.jshell.execution","jdk.jshell.spi","jdk.jshell.tool","jdk.management.jfr","jdk.nashorn.api.scripting","jdk.nashorn.api.tree","jdk.net","jdk.nio","jdk.security.jarsigner","netscape.javascript","org.ietf.jgss","org.w3c.dom","org.w3c.dom.bootstrap","org.w3c.dom.css","org.w3c.dom.events","org.w3c.dom.html","org.w3c.dom.ls","org.w3c.dom.ranges","org.w3c.dom.stylesheets","org.w3c.dom.traversal","org.w3c.dom.views","org.w3c.dom.xpath","org.xml.sax","org.xml.sax.ext","org.xml.sax.helpers"]

    for i in illegal_imports:
        if(data.find(i)!=-1):
            st="Illegal import: " + i
            break
    return st


def pycode(lines):
    filepath = sys.argv[1]

    st=checking_function(filepath)
    if(len(st)!=0):
        with open("output.txt","w") as f:
            f.write(st)
    else:
        for line in lines: 
            try:
                command = "python " + filepath
                s = subprocess.run(command,text=True,timeout=1,input=codecs.decode(line, 'unicode_escape'))
                if s.returncode == 0:
                    p = subprocess.run(command,shell=True,capture_output=True,text=True,input=codecs.decode(line, 'unicode_escape'))
                    with open("output.txt","a") as f:
                        f.write(p.stdout)
                else:
                    string = "Runtime error\n"
                    with open("output.txt","w") as f:
                        f.write(string)
                    break
            except subprocess.TimeoutExpired:
                with open("output.txt","w") as f:
                    f.write("TLE\n")
                break 

def ccode(lines):
    filepath = sys.argv[1]
    st=checking_function(filepath)
    if(len(st)!=0):
        with open("output.txt","w") as f:
            f.write(st)
    else:
        filename = os.path.basename(filepath).split('.')[0]
        command = "gcc " + filename + ".c -o " + filename
        s = subprocess.run(command,capture_output=True,text=True,shell=True)
        if s.returncode != 0:
            with open("output.txt","w") as f:
                f.write("Compilation error\n")
        else:
            for line in lines: 
                try:
                    cmd = filename+".exe"
                    s = subprocess.run(cmd,timeout=1,text=True,input=codecs.decode(line, 'unicode_escape'))     
                    if s.returncode == 0:
                        p = subprocess.run(filename + ".exe",shell=True,capture_output=True,text=True,input=codecs.decode(line, 'unicode_escape'))  
                        string = p.stdout 
                        with open("output.txt","a") as f:
                            f.write(string)
                    else:
                        with open("output.txt","w") as f:
                            f.write("Runtime error\n")
                        break
                except subprocess.TimeoutExpired:
                    with open("output.txt","w") as f:
                        f.write("TLE\n")
                    break

def cppcode(lines):
    filepath = sys.argv[1]
    st=checking_function(filepath)
    if(len(st)!=0):
        with open("output.txt","w") as f:
            f.write(st)
    else:
        filename = os.path.basename(filepath).split('.')[0]
        command = "g++ -o " + filename + ".exe " + filename + ".cpp"
        s = subprocess.run(command,capture_output=True,text=True,shell=True)
        if s.returncode != 0:
            with open("output.txt","w") as f:
                f.write("Compilation error\n")
        else:
            for line in lines:
                try:
                    cmd = filename+".exe"
                    s = subprocess.run(cmd,timeout=1,text=True,input=codecs.decode(line, 'unicode_escape')) 
                    if s.returncode == 0:
                        p = subprocess.run(filename + ".exe ",shell=True,capture_output=True,text=True,input=codecs.decode(line, 'unicode_escape'))
                        string = p.stdout 
                        with open("output.txt","a") as f:
                            f.write(string)
                    else:
                        with open("output.txt","w") as f:
                            f.write("Runtime error\n")
                        break
                except subprocess.TimeoutExpired:
                    with open("output.txt","w") as f:
                        f.write("TLE\n")
                    break

def javacode(lines):
    filepath = sys.argv[1]
    st=checking_function(filepath)
    if(len(st)!=0):
        with open("output.txt","w") as f:
            f.write(st)
    else:
        command = "javac MyClass.java"
        s = subprocess.run(command,capture_output=True,text=True,shell=True)
        if s.returncode != 0:
            with open("output.txt","w") as f:
                f.write("Compilation error\n")
        else:
            for line in lines:    
                try:
                    s = subprocess.run("java MyClass",timeout=1,text=True,input=codecs.decode(line, 'unicode_escape'))
                    if s.returncode == 0:
                        p = subprocess.run("java MyClass",shell=True,capture_output=True,text=True,input=codecs.decode(line, 'unicode_escape'))
                        string = p.stdout
                        with open("output.txt","a") as f:
                            f.write(string)
                    else:
                        with open("output.txt","w") as f:
                            f.write("Runtime error\n")
                        break
                except subprocess.TimeoutExpired:
                    with open("output.txt","w") as f:
                        f.write("TLE\n")
                    break

def run(flag, format):
    baseDir = os.getcwd()
    lines = fetchInput(flag)
    if format == "cpp":
        cppcode(lines)
    elif format == "c":
        ccode(lines)
    elif format == "py":
        pycode(lines)
    elif format == "java":
        javacode(lines)
    score = 0
    output = [""]
    try:
        with open("output.txt", "r") as f:
            output = f.readlines()
            count = output.count("\n")
            for i in range(count):
                output.remove("\n")
            if(output[-1][-1] == "\n"):
                output[-1] = output[-1][0:-1]
        os.chdir(baseDir)
        if flag == True:
            score = check(output)
    except Exception:
        pass
    update(output, score)

flag = False
if len(sys.argv) == 5:
    flag = True
format = sys.argv[2]
run(flag, format)