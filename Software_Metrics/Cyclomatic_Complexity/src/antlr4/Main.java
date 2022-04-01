package antlr4;

import java.io.IOException;

import org.antlr.v4.runtime.ANTLRFileStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.ParserRuleContext;

import grammar.JavaLexer;
import grammar.JavaParser;

public class Main {
	public static void main(String[] args) throws IOException {
		
		String input_file = args[0];
		String output_file = args[1];
		
		Lexer lexer = new JavaLexer(new ANTLRFileStream(input_file));
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		JavaParser parser = new JavaParser(tokens);
		ParserRuleContext tree = parser.compilationUnit();
		
		// NOTE : hard-coded path to output file
		CyclomaticComplexityVisitor mv = new CyclomaticComplexityVisitor(output_file);
		mv.visit(tree);
	}
}
