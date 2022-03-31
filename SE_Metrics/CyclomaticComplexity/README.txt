Compilation :
1. CD into the "src" directory.
2. Run the command "javac -cp :../lib/antlr-runtime-4.5.2.jar:../lib/json-simple-1.1.1.jar antlr4/*.java grammar/*.java -d ../bin/" 
3. The compiled output will be saved to the "bin" directory.

Running :
1. CD into the "bin" directory.
2. Run the command "java -cp :../lib/antlr-runtime-4.5.2.jar:../lib/json-simple-1.1.1.jar antlr4.Main ../input/Hello.java"
3. The output is save to output/Output.json

